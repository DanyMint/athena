import csv
from datetime import datetime

from django.db import transaction
from admissions.models import (
    Entrant, College, Qualification, LanguageOfStudy,
    PreviousPlaceOfStudy, PreviousPlaceOfStudyType,
    CitizenshipList, Nationality, Quota, Parent, HowFoundOut
)

COLLEGE_ID = College.objects.first()

CSV_FILE_PATH = '/app/zayavki.csv'

PREPARED_PLACES_OF_STUDY = [
    {"name":'Школа 9 классов', "base": 2},
    {"name":'Школа 11 классов', "base": 3}
]

PLACE_OF_STUDY_MAP = {
   '11': 3,
   '9': 2,
}

LANGUAGE_MAP = {
    'ru': 'Русских язык',
    'kz': 'Казахский',
    '':'Русских язык'
}

QUALIFICATION_MAP = {
    '4S06130103 Разработчик программного обеспечения': 'Norma',
    '4S04120202 Техник-оценщик': 'Trulalela',
    '4S04110102 Бухгалтер': 'Тест',
    '4S06130104 Техник по сопровождению и тестированию программного обеспечения': 'Norma',
    '4S04110102 Бухгалтер (план)': 'Тест',
    '4S04120202 Техник-оценщик (план)': 'Trulalela',
    '4S04120202 Техник-оценщик  (план)': 'Trulalela',
    '4S04210101 Юрист (платное)': 'Trulalela',
    '':'Тест'
}

QUOTA_MAP = {
    'Сирота': 'Сирота',
    'Инвалид': 'Инвалид',
    'Нет': '',
    'Многодетные семьи (4+ детей)':'Квота 2',
    'Неполные семьи (3+ лет)':'Квота 2',
    'Семьи с детьми-инвалидами или инвалидами I/II группы':'Квота 1',
    'Инвалиды I/II группы, дети-инвалиды':'Квота 1',
    'Дети-сироты, оставшиеся без попечения' :'Квота 1',

}

def get_language(name):
    try:
        return LanguageOfStudy.objects.get(name=LANGUAGE_MAP[name])
    except KeyError:
        raise ValueError(f"⚠️ Неизвестный язык: {name}")
    except LanguageOfStudy.DoesNotExist:
        raise ValueError(f"⚠️ Язык не найден в базе: {LANGUAGE_MAP[name]}")

def get_qualification(name):
    try:
        return Qualification.objects.get(name=QUALIFICATION_MAP[name])
    except KeyError:
        raise ValueError(f"⚠️ Неизвестная квалификация: {name}")
    except Qualification.DoesNotExist:
        raise ValueError(f"⚠️ Квалификация не найдена: {QUALIFICATION_MAP[name]}")


def get_or_create_parents(raw):
    phone_numbers = [s.strip() for s in raw.split(',') if s.strip()]
    parent_objs = []
    first_name = "parent_first_name"
    last_name =  "parent_last_name"

    for phone in phone_numbers:
        parent, _ = Parent.objects.get_or_create(
            phone_number=phone,
            first_name=first_name,
            last_name=last_name
        )
        parent_objs.append(parent)
    return parent_objs

def get_quotas(raw):
    names = [s.strip() for s in raw.split(',') if s.strip()]
    quota_objs = []
    for name in names:
        if not name or name not in QUOTA_MAP:
            continue
        quota_name = QUOTA_MAP[name]
        if quota_name:
            try:
                qq = Quota.objects.get(name=quota_name)
                quota_objs.append(qq)
            except Quota.DoesNotExist:
                raise ValueError(f"⚠️ Квота не найдена: {quota_name}")
    return quota_objs


def get_or_create_sources(raw):
    information_sources = [s.strip() for s in raw.split(',') if s.strip()]
    information_source_objs = []
    college = COLLEGE_ID

    for source in information_sources:
        info_obj, _ = HowFoundOut.objects.get_or_create(
            college=college,
            information_source=source
        )
        information_source_objs.append(info_obj)
    return information_source_objs


def import_zayavki_from_csv():
    with open(CSV_FILE_PATH, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        created_count = 0

        for row in reader:
            try:
                with transaction.atomic():
                    fio_parts = row['ФИО'].strip().split()
                    last_name = fio_parts[0] if len(fio_parts) > 0 else ''
                    first_name = fio_parts[1] if len(fio_parts) > 1 else ''
                    patronymic = fio_parts[2] if len(fio_parts) > 2 else ''
                    iin = row['ИИН'].strip()[:12]
                    birth_date = datetime.strptime(row['Дата'], "%Y-%m-%d %H:%M:%S").date()
                    gender = "М"

                    citizenship = CitizenshipList.objects.first()
                    nationality = Nationality.objects.first()
                    qualification = get_qualification(row['Программа'].strip())
                    college = College.objects.first()
                    language = get_language(row['Язык обучения'].strip())
                    quotas = get_quotas(row.get('Квота', ''))

                    base_of_study = row['Класс'].strip()
                    place_name = f"Школа {base_of_study} класс"
                    previous_place_of_study_type_class = PreviousPlaceOfStudyType.objects.get_or_create(
                        id=PLACE_OF_STUDY_MAP[base_of_study]
                    )[0]
                    previous_place = PreviousPlaceOfStudy.objects.get_or_create(
                        name=place_name,
                        previous_place_of_study_type=previous_place_of_study_type_class
                    )[0]

                    parents = get_or_create_parents(row['Контакт представителя'].strip()[:11])
                    how_found_out_about_college = get_or_create_sources(row['Источник'].strip())

                    entrant, created = Entrant.objects.get_or_create(
                        individual_identical_number=iin,
                        defaults={
                            'first_name': first_name,
                            'last_name': last_name,
                            'patronymic': patronymic,
                            'birth_date': birth_date,
                            'gender': gender,
                            'citizenship': citizenship,
                            'nationality': nationality,
                            'qualification': qualification,
                            'college': college,
                            'language_of_study': language,
                            'previous_place_of_study': previous_place,
                            'on_the_budget': True
                        }
                    )
                    if created:
                        entrant.quota.set(quotas)
                        entrant.parents.set(parents)
                        entrant.how_found_out_about_college.set(how_found_out_about_college)
                        created_count += 1

            except Exception as e:
                print(f"\n❌ Ошибка в строке: {row}")
                print(f"Причина: {e}")

        print(f"\n✅ Импорт завершен. Создано заявок: {created_count}")
