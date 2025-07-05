from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.filters import SearchFilter
from rest_framework.decorators import api_view
from admissions.tools.report import get_report
from django.http import HttpResponse
from django.db.utils import OperationalError
import psycopg
from rest_framework.response import Response
from rest_framework import  status
from core.logger import logger

from admissions.models import (
    Quota,
    Specialty,
    LanguageOfStudy,
    PreviousPlaceOfStudyType,
    Entrant,
    Nationality,
    CitizenshipList,
    Parent,
    AdmissionsGrant,
    College,
    Qualification,
    PreviousPlaceOfStudy,
    HowFoundOut
)
from .paginations import EntrantsSetPagination, DirectoryManagmentSetPagination
from .serializers import (
    QuotaSerializer,
    SpecialtySerializer,
    LanguageOfStudySerializer,
    PreviousPlaceOfStudyTypeSerializer,
    EntrantSerializer,
    CitizenshipListSerializer,
    NationalityListSerializer,
    EntrantListSerializer,
    ParentsListSerializer,
    AdmissionsGrantSerializer,
    CollegeGrantSerializer,
    QualificationSerializer,
    PreviousPlaceOfStudySerializer,
    PreviousPlaceOfStudyLabelSerializer,
    HowFoundOutListSerializer
)


class QuotaListCreate(generics.ListCreateAPIView):
    queryset = Quota.objects.all()
    serializer_class = QuotaSerializer
    pagination_class = DirectoryManagmentSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['name', 'description']
    search_fields = ['name', 'description']


class QuotaReadUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quota.objects.all()
    serializer_class = QuotaSerializer


class SpecialtyListCreate(generics.ListCreateAPIView):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    pagination_class = DirectoryManagmentSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['name', 'code']
    search_fields = ['name', 'code']


class SpecialtyReadUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer


class LangOfStudyListCreate(generics.ListCreateAPIView):
    queryset = LanguageOfStudy.objects.all()
    serializer_class = LanguageOfStudySerializer
    pagination_class = DirectoryManagmentSetPagination

    filter_backends = [SearchFilter]
    search_fields = ['name']


class LangOfStudyReadUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = LanguageOfStudy.objects.all()
    serializer_class = LanguageOfStudySerializer


class PreviousPlaceOfStudyTypeListCreate(generics.ListCreateAPIView):
    queryset = PreviousPlaceOfStudyType.objects.all()
    serializer_class = PreviousPlaceOfStudyTypeSerializer
    pagination_class = DirectoryManagmentSetPagination

    filter_backends = [SearchFilter]
    search_fields = ['name']


class PreviousPlaceOfStudyTypeReadUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = PreviousPlaceOfStudyType.objects.all()
    serializer_class = PreviousPlaceOfStudyTypeSerializer


class BaseListCreateView(generics.ListCreateAPIView):
    def handle_exception(self, exc):
        logger.info(f"Бляя {exc}")
        if isinstance(exc, (OperationalError, psycopg.OperationalError)):
            logger.error(exc)
            return Response(
                {'error': "У нас возникли технические шоколадки"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        return super().handle_exception(exc)


class EntrantListCreate(generics.ListCreateAPIView):
    queryset = Entrant.objects.all()
    serializer_class = EntrantListSerializer
    pagination_class = EntrantsSetPagination

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['quota', 'qualification']
    search_fields = ['individual_identical_number', 'first_name', 'last_name']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EntrantSerializer
        return EntrantListSerializer


class EntrantReadUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entrant.objects.all()
    serializer_class = EntrantSerializer



class CitizenshipListCreate(generics.ListCreateAPIView):
    queryset = CitizenshipList.objects.all()
    serializer_class = CitizenshipListSerializer
    pagination_class = DirectoryManagmentSetPagination

    filter_backends = [SearchFilter]
    search_fields = ['name']


class CitizenshipReadUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = CitizenshipList.objects.all()
    serializer_class = CitizenshipListSerializer


class NationalityReadUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Nationality.objects.all()
    serializer_class = NationalityListSerializer


class NationalityListCreate(generics.ListCreateAPIView):
    queryset = Nationality.objects.all()
    serializer_class = NationalityListSerializer
    pagination_class = DirectoryManagmentSetPagination

    filter_backends = [SearchFilter]
    search_fields = ['name']


class ParentReadUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Parent.objects.all()
    serializer_class =  ParentsListSerializer


class ParentsListCreate(generics.ListCreateAPIView):
    queryset = Parent.objects.all()
    serializer_class =  ParentsListSerializer


    filter_backends = [SearchFilter]
    search_fields = [
        'first_name',
        'last_name' ,
        'patronymic'
        ]

class GrantsReadUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AdmissionsGrantSerializer
    def get_queryset(self):
        return AdmissionsGrant.objects.with_fulfillment()

class GrantsListCreate(generics.ListCreateAPIView):
    serializer_class = AdmissionsGrantSerializer

    def get_queryset(self):
        return AdmissionsGrant.objects.with_fulfillment()


    pagination_class = DirectoryManagmentSetPagination

    filter_backends = [SearchFilter]
    search_fields = [
        'college',
        'qualification',
        'previous_place_of_study_type',
    ]


class CollegeReadUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = College.objects.all()
    serializer_class = CollegeGrantSerializer

class CollegesListCreate(generics.ListCreateAPIView):
    queryset = College.objects.all()
    serializer_class = CollegeGrantSerializer

class QualificationReadUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Qualification.objects.all()
    serializer_class = QualificationSerializer

class QualificationsListCreate(generics.ListCreateAPIView):
    queryset = Qualification.objects.all()
    serializer_class = QualificationSerializer

    pagination_class = DirectoryManagmentSetPagination
    filter_backends = [SearchFilter]
    search_fields = [
        'name',
        'code'
    ]


class PreviousPlaceOfStudyReadUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = PreviousPlaceOfStudy.objects.all()
    serializer_class = PreviousPlaceOfStudySerializer


class PreviousPlacesOfStudyListCreate(generics.ListCreateAPIView):
    queryset = PreviousPlaceOfStudy.objects.all()
    serializer_class = PreviousPlaceOfStudyLabelSerializer

    pagination_class = DirectoryManagmentSetPagination
    filter_backends = [SearchFilter]
    search_fields = [
        'name',
        'previous_place_of_study_type'
    ]


class HowFoundOutListCreate(generics.ListCreateAPIView):
    queryset = HowFoundOut.objects.all()
    serializer_class = HowFoundOutListSerializer

    pagination_class = DirectoryManagmentSetPagination
    filter_backends = [SearchFilter]
    search_fields = [
        'information_source',
    ]


@api_view(["GET"])
def get_csv_report(reuqest):
    csv_file_value = get_report().getvalue()

    response = HttpResponse(csv_file_value, content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="report.csv"'

    return response
