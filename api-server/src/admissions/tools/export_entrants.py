from admissions.models import Entrant
import csv
import io
from django.forms.models import model_to_dict


def get_field_verbose_name(field):
    """
    Получает verbose_name поля или возвращает название поля, если verbose_name нет

    Args:
        field: Поле модели Django

    Returns:
        str: verbose_name или название поля
    """
    return getattr(field, 'verbose_name', field.name) or field.name


def get_available_fields():
    """
    Возвращает словарь доступных полей модели Entrant
    с сопоставлением: field_name -> verbose_name (или field_name если verbose_name нет)
    """
    model_fields = Entrant._meta.get_fields()
    available_fields = {}

    for field in model_fields:
        verbose_name = get_field_verbose_name(field)
        available_fields[field.name] = verbose_name

    return available_fields


def get_field_names_list():
    """
    Возвращает список всех названий полей модели
    """
    return [field.name for field in Entrant._meta.get_fields()]


def get_readable_field_names(fields=None):
    """
    Возвращает список verbose_name полей (или названий полей, если verbose_name нет)

    Args:
        fields (list): Список полей для получения verbose названий.
                      Если None, возвращаются все поля.

    Returns:
        list: Список verbose названий полей
    """
    if fields is None:
        fields = get_field_names_list()

    model_fields = {field.name: field for field in Entrant._meta.get_fields()}

    readable_names = []
    for field_name in fields:
        if field_name in model_fields:
            verbose_name = get_field_verbose_name(model_fields[field_name])
            readable_names.append(verbose_name)
        else:
            readable_names.append(field_name)  # Fallback если поле не найдено

    return readable_names


def get_entrants_data_advanced(fields=None, include_related=True):
    """
    Расширенная функция для получения данных абитуриентов с обработкой всех типов полей

    Args:
        fields (list): Список полей для выборки
        include_related (bool): Включать ли связанные поля в читаемом виде

    Returns:
        list: Список словарей с данными абитуриентов
    """
    from django.db import models

    if fields is None:
        fields = get_field_names_list()

    # Проверяем, что все поля существуют в модели
    available_fields = get_field_names_list()
    invalid_fields = [field for field in fields if field not in available_fields]

    if invalid_fields:
        raise ValueError(f"Неизвестные поля: {invalid_fields}")

    # Получаем информацию о полях модели
    model_fields = {field.name: field for field in Entrant._meta.get_fields()}

    # Классифицируем поля по типам
    foreign_key_fields = []
    many_to_many_fields = []
    choice_fields = []
    regular_fields = []

    for field_name in fields:
        if field_name in model_fields:
            field = model_fields[field_name]

            if isinstance(field, models.ForeignKey):
                foreign_key_fields.append(field_name)
            elif isinstance(field, models.ManyToManyField):
                many_to_many_fields.append(field_name)
            elif hasattr(field, 'choices') and field.choices:
                choice_fields.append(field_name)
            else:
                regular_fields.append(field_name)

    # Создаем оптимизированный queryset
    queryset = Entrant.objects.all()

    # Добавляем select_related для ForeignKey полей
    if foreign_key_fields and include_related:
        queryset = queryset.select_related(*foreign_key_fields)

    # Добавляем prefetch_related для ManyToMany полей
    if many_to_many_fields and include_related:
        queryset = queryset.prefetch_related(*many_to_many_fields)

    # Получаем данные
    entrants = list(queryset)

    # Преобразуем данные
    result = []
    for entrant in entrants:
        row = {}

        for field_name in fields:
            if field_name in foreign_key_fields and include_related:
                # ForeignKey поля - получаем строковое представление
                related_obj = getattr(entrant, field_name, None)
                row[field_name] = str(related_obj) if related_obj else None

            elif field_name in many_to_many_fields and include_related:
                # ManyToMany поля - получаем список связанных объектов
                related_manager = getattr(entrant, field_name)
                related_objects = related_manager.all()
                row[field_name] = ', '.join([str(obj) for obj in related_objects])

            elif field_name in choice_fields:
                # Поля с choices - получаем читаемое значение
                value = getattr(entrant, field_name, None)
                if value:
                    choices_dict = dict(model_fields[field_name].choices)
                    row[field_name] = choices_dict.get(value, value)
                else:
                    row[field_name] = value

            else:
                # Обычные поля
                value = getattr(entrant, field_name, None)

                # Специальная обработка для некоторых типов полей
                if isinstance(value, models.Model):
                    row[field_name] = str(value)
                elif hasattr(value, '__iter__') and not isinstance(value, (str, bytes)):
                    # Для итерируемых объектов (кроме строк)
                    row[field_name] = ', '.join([str(item) for item in value])
                else:
                    row[field_name] = value

        result.append(row)

    return result


def get_entrants_data(fields=None):
    """
    Получает данные абитуриентов по выбранным полям с человеко-читаемой информацией

    Args:
        fields (list): Список полей для выборки.
                      Если None, возвращаются все поля.

    Returns:
        list: Список словарей с данными абитуриентов
    """
    return get_entrants_data_advanced(fields, include_related=True)


def export_entrants_csv(fields=None):
    """
    Экспортирует данные абитуриентов в CSV формат

    Args:
        fields (list): Список полей для экспорта.
                      Если None, экспортируются все поля.

    Returns:
        io.StringIO: CSV данные в виде строкового потока
    """
    if fields is None:
        fields = get_field_names_list()

    output = io.StringIO()
    writer = csv.writer(output)

    # Получаем данные
    data = get_entrants_data(fields)
    readable_headers = get_readable_field_names(fields)

    # Записываем заголовки
    writer.writerow(readable_headers)

    # Записываем данные
    for row in data:
        # Сортируем значения в том же порядке, что и поля
        row_values = [row.get(field, '') for field in fields]
        writer.writerow(row_values)

    output.seek(0)
    return output


# Примеры использования:

def get_entrants_data_with_formatters(fields=None, field_formatters=None):
    """
    Получает данные абитуриентов с возможностью кастомного форматирования полей

    Args:
        fields (list): Список полей для выборки
        field_formatters (dict): Словарь с кастомными форматтерами для полей
                                Формат: {'field_name': lambda obj, value: formatted_value}

    Returns:
        list: Список словарей с данными абитуриентов
    """
    from django.db import models

    if fields is None:
        fields = get_field_names_list()

    if field_formatters is None:
        field_formatters = {}

    # Проверяем, что все поля существуют в модели
    available_fields = get_field_names_list()
    invalid_fields = [field for field in fields if field not in available_fields]

    if invalid_fields:
        raise ValueError(f"Неизвестные поля: {invalid_fields}")

    # Получаем информацию о полях модели
    model_fields = {field.name: field for field in Entrant._meta.get_fields()}

    # Определяем поля для оптимизации запросов
    foreign_key_fields = []
    many_to_many_fields = []

    for field_name in fields:
        if field_name in model_fields:
            field = model_fields[field_name]
            if isinstance(field, models.ForeignKey):
                foreign_key_fields.append(field_name)
            elif isinstance(field, models.ManyToManyField):
                many_to_many_fields.append(field_name)

    # Создаем оптимизированный queryset
    queryset = Entrant.objects.all()

    if foreign_key_fields:
        queryset = queryset.select_related(*foreign_key_fields)

    if many_to_many_fields:
        queryset = queryset.prefetch_related(*many_to_many_fields)

    # Получаем данные
    entrants = list(queryset)

    # Преобразуем данные
    result = []
    for entrant in entrants:
        row = {}

        for field_name in fields:
            # Получаем сырое значение поля
            raw_value = getattr(entrant, field_name, None)

            # Применяем кастомный форматтер, если есть
            if field_name in field_formatters:
                formatted_value = field_formatters[field_name](entrant, raw_value)
            else:
                # Используем стандартное форматирование
                formatted_value = format_field_value(model_fields.get(field_name), raw_value)

            row[field_name] = formatted_value

        result.append(row)

    return result


def format_field_value(field, value):
    """
    Стандартное форматирование значения поля

    Args:
        field: Django поле модели
        value: Значение поля

    Returns:
        Отформатированное значение
    """
    from django.db import models

    if value is None:
        return None

    # ForeignKey поля
    if isinstance(field, models.ForeignKey):
        return str(value)

    # ManyToMany поля
    elif isinstance(field, models.ManyToManyField):
        if hasattr(value, 'all'):
            return ', '.join([str(obj) for obj in value.all()])
        return str(value)

    # Поля с choices
    elif hasattr(field, 'choices') and field.choices:
        choices_dict = dict(field.choices)
        return choices_dict.get(value, value)

    # Boolean поля
    elif isinstance(field, models.BooleanField):
        return 'Да' if value else 'Нет'

    # Date/DateTime поля
    elif isinstance(field, (models.DateField, models.DateTimeField)):
        if hasattr(value, 'strftime'):
            if isinstance(field, models.DateTimeField):
                return value.strftime('%d.%m.%Y %H:%M')
            else:
                return value.strftime('%d.%m.%Y')
        return str(value)

    # Обычные поля
    else:
        return value


# Примеры кастомных форматтеров
def get_default_field_formatters():
    """
    Возвращает словарь с примерами кастомных форматтеров полей
    """
    return {
        # Пример: форматирование телефона
        'phone': lambda obj, value: f"+7 ({value[1:4]}) {value[4:7]}-{value[7:9]}-{value[9:11]}" if value and len(value) == 11 else value,

        # Пример: форматирование ИИН
        'iin': lambda obj, value: f"{value[:6]}-{value[6:]}" if value and len(value) == 12 else value,

        # Пример: полное имя с инициалами
        'full_name': lambda obj, value: value.upper() if value else None,

        # Пример: форматирование статуса
        'status': lambda obj, value: f"🟢 {value}" if value == 'active' else f"🔴 {value}",

        # Пример: комбинированное поле
        'contact_info': lambda obj, value: f"{obj.phone} ({obj.email})" if obj.phone and obj.email else (obj.phone or obj.email or 'Нет контактов'),
    }
