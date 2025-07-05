from django.db import models
from django.core.validators import RegexValidator
import uuid
from django.utils import timezone
from django.db.models import Count,  F, OuterRef, Subquery, IntegerField

class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class BaseModel(models.Model):
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    # created_at = models.DateTimeField(auto_now_add=True )
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()


class College(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Колледж'
        verbose_name_plural = 'Колледжи'
        indexes = [
            models.Index(fields=['name']),
        ]


class Quota(BaseModel):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(max_length=350)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Квота'
        verbose_name_plural = 'Квоты'
        indexes = [
            models.Index(fields=['name']),
        ]


class LanguageOfStudy(BaseModel):
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Язык обучения'
        verbose_name_plural = 'Языки обучения'


class Specialty(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

    class Meta:
        verbose_name = 'Специальность'
        verbose_name_plural = 'Специальности'
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['name']),
        ]


class Qualification(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=50, unique=True)
    specialty = models.ForeignKey(Specialty, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

    class Meta:
        verbose_name = 'Квалификация'
        verbose_name_plural = 'Квалификации'
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['specialty']),
        ]


class PreviousPlaceOfStudyType(BaseModel):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тип учебного заведения'
        verbose_name_plural = 'Типы учебных заведений'


class PreviousPlaceOfStudy(BaseModel):
    name = models.CharField(max_length=150)
    previous_place_of_study_type = models.ForeignKey(PreviousPlaceOfStudyType, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        type_name = self.previous_place_of_study_type.name if self.previous_place_of_study_type else "Без типа"
        return f"{self.name} - {type_name}"

    class Meta:
        verbose_name = 'Предыдущее место обучения'
        verbose_name_plural = 'Предыдущие места обучения'
        indexes = [
            models.Index(fields=['previous_place_of_study_type']),
        ]


class CitizenshipList(BaseModel):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Гражданство'
        verbose_name_plural = 'Гражданства'


class Nationality(BaseModel):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Национальность'
        verbose_name_plural = 'Национальности'


class HowFoundOut(BaseModel):
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True)
    information_source = models.CharField(max_length=250)

    def __str__(self):
        return f"{self.college} - {self.information_source}"

    class Meta:
        verbose_name = 'Источник информации'
        verbose_name_plural = 'Источники информации'
        indexes = [
            models.Index(fields=['college']),
        ]

class AdmissionsGrantManager(models.Manager):
    def with_fulfillment(self):
        entrants = Entrant.objects.filter(
            on_the_budget=True,
            previous_place_of_study__previous_place_of_study_type=OuterRef('previous_place_of_study_type'),
            college=OuterRef('college'),
            qualification=OuterRef('qualification')
        ).values('college', 'qualification', 'previous_place_of_study__previous_place_of_study_type')\
         .annotate(entrant_count=Count('id'))\
         .values('entrant_count')

        return self.get_queryset().annotate(
            actual=Subquery(entrants, output_field=IntegerField()),
            fulfilled_percent=100 * (Subquery(entrants, output_field=IntegerField()) / F('places'))
        )

class AdmissionsGrant(BaseModel):
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True)
    qualification = models.ForeignKey(Qualification, on_delete=models.SET_NULL, null=True)
    previous_place_of_study_type = models.ForeignKey(PreviousPlaceOfStudyType, on_delete=models.SET_NULL, null=True)
    places = models.PositiveIntegerField()
    objects = AdmissionsGrantManager()

    def __str__(self):
        return f"{self.college} - {self.qualification} ({self.places} мест)"

    class Meta:
        verbose_name = 'Грант на поступление'
        verbose_name_plural = 'Гранты на поступление'
        indexes = [
            models.Index(fields=['college', 'qualification']),
            models.Index(fields=['qualification']),
        ]


class Parent(BaseModel):
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    patronymic = models.CharField(max_length=150, blank=True, default="")

    phone_validator = RegexValidator(
        regex=r'^\d{1,11}$',
        message="Номер телефона должен быть в формате: '999999999'. До 11 цифр."
    )

    phone_number = models.CharField(
            max_length=11,
            validators=[phone_validator],
            blank=True,
            default=""
        )

    job_place = models.CharField(max_length=150, blank=True, default="")

    def __str__(self):
        full_name = f"{self.last_name} {self.first_name}"
        if self.patronymic:
            full_name += f" {self.patronymic}"
        return full_name

    class Meta:
        verbose_name = 'Родитель'
        verbose_name_plural = 'Родители'
        indexes = [
            models.Index(fields=['last_name', 'first_name']),
        ]



class Entrant(BaseModel):
    GENDER_CHOICES = {'М': "Мужчина", "Ж": "Женщина"}
    STUDY_FORMAT_CHOICES = {"Очное обучение": "Очное обучение", "Заочное обучение": "Заочное обучение"}

    phone_validator = RegexValidator(
        regex=r'^\d{1,11}$',
        message="Номер телефона должен быть в формате: '999999999'. До 11 цифр."
    )

    iin_validator = RegexValidator(
        regex=r'^\d{12}$',
        message='ИИН должен содержать 12 цифр'
    )

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    patronymic = models.CharField(max_length=150, blank=True, default="")
    birth_date = models.DateField("Дата рождения")
    individual_identical_number = models.CharField(
        max_length=12,
        unique=True,
        validators=[iin_validator],
        verbose_name="ИИН"
    )
    quota = models.ManyToManyField(Quota, blank=True)
    language_of_study = models.ForeignKey(LanguageOfStudy, on_delete=models.SET_NULL, null=True)
    on_the_budget = models.BooleanField(default=True, verbose_name="На бюджете")
    previous_place_of_study = models.ForeignKey(PreviousPlaceOfStudy, on_delete=models.SET_NULL, null=True)
    qualification = models.ForeignKey(Qualification, on_delete=models.SET_NULL, null=True)
    citizenship = models.ForeignKey(CitizenshipList, on_delete=models.SET_NULL, null=True)
    nationality = models.ForeignKey(Nationality, on_delete=models.SET_NULL, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, default="")
    study_format = models.CharField(max_length=20, choices=STUDY_FORMAT_CHOICES, blank=True, default="")
    entrant_phone_number = models.CharField(
        max_length=11,
        validators=[phone_validator],
        blank=True,
        default=""
    )
    how_found_out_about_college = models.ManyToManyField(HowFoundOut, blank=True)
    residence_address = models.CharField(max_length=200, blank=True, default="")
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True)
    parents = models.ManyToManyField(Parent, blank=True)

    def __str__(self):
        full_name = f"{self.first_name} {self.last_name}"
        if self.patronymic:
            full_name += f" {self.patronymic}"
        return full_name

    class Meta:
        verbose_name = 'Абитуриент'
        verbose_name_plural = 'Абитуриенты'
        indexes = [
            models.Index(fields=['college','last_name', 'first_name']),
            models.Index(fields=['college', 'qualification']),
            models.Index(fields=['college','individual_identical_number']),
            models.Index(fields=['college']),
        ]
