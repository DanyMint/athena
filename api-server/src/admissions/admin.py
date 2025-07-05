from django.contrib import admin
from admissions.models import Entrant
from admissions.models import Parent
from admissions.models import Specialty
from admissions.models import Qualification
from admissions.models import Quota
from admissions.models import CitizenshipList
from admissions.models import College
from admissions.models import LanguageOfStudy
from admissions.models import PreviousPlaceOfStudyType
from admissions.models import PreviousPlaceOfStudy
from admissions.models import Nationality
from admissions.models import HowFoundOut
from admissions.models import AdmissionsGrant

@admin.register(AdmissionsGrant)
class AdmissionsGrant(admin.ModelAdmin):
    pass

@admin.register(HowFoundOut)
class HowFoundOutAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return HowFoundOut.all_objects.all()

@admin.register(Nationality)
class NationalityAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return Nationality.all_objects.all()

@admin.register(PreviousPlaceOfStudy)
class PreviousPlaceOfStudyAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return PreviousPlaceOfStudy.all_objects.all()

@admin.register(PreviousPlaceOfStudyType)
class PreviousPlaceOfStudyTypeAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return PreviousPlaceOfStudyType.all_objects.all()

@admin.register(LanguageOfStudy)
class LanguageOfStudyAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return LanguageOfStudy.all_objects.all()

@admin.register(Entrant)
class EntrantAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return Entrant.all_objects.all()


@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return Parent.all_objects.all()


@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return Specialty.all_objects.all()


@admin.register(Qualification)
class QualificationAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return Qualification.all_objects.all()


@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return College.all_objects.all()


@admin.register(CitizenshipList)
class CitizenshipListAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return CitizenshipList.all_objects.all()


@admin.register(Quota)
class QuotaAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return Quota.all_objects.all()
