from cProfile import label
from rest_framework import serializers

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

class HowFoundOutListSerializer(serializers.ModelSerializer):
    class Meta:
        model = HowFoundOut
        fields = ['id',"information_source"]

class PreviousPlaceOfStudyLabelSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    previous_place_of_study_type = serializers.SlugRelatedField(
        slug_field="name",
        queryset=PreviousPlaceOfStudyType.objects.all()
    )

    class Meta:
        model = PreviousPlaceOfStudy
        fields = ['id','name', 'previous_place_of_study_type']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        type_name = instance.previous_place_of_study_type.name if instance.previous_place_of_study_type else "Без типа"
        rep['name'] = f"{instance.name} - {type_name}"
        return rep


class PreviousPlaceOfStudySerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    previous_place_of_study_type = serializers.SlugRelatedField(
        slug_field="name",
        queryset=PreviousPlaceOfStudyType.objects.all()
    )

    class Meta:
        model = PreviousPlaceOfStudy
        fields = ['id','name', 'previous_place_of_study_type']



class QuotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quota
        fields = ("id", "name", "description")


class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ("id", "name", "code")


class LanguageOfStudySerializer(serializers.ModelSerializer):
    class Meta:
        model = LanguageOfStudy
        fields = ("id", "name")


class PreviousPlaceOfStudyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreviousPlaceOfStudyType
        fields = ("id", "name")


class EntrantListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrant
        fields = [
        'id',
        'first_name',
        'last_name',
        'patronymic',
        'individual_identical_number',
        'qualification',
        'quota'
        ]

    qualification = serializers.SlugRelatedField(
        slug_field="name",
        queryset=Qualification.objects.all()
    )

    quota = serializers.SlugRelatedField(
        many=True,
        slug_field="name",
        queryset=Quota.objects.all()
    )

class ParentsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = "__all__"


class ParentsForEntrantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = [
            'id',
            'first_name',
            'last_name',
            'patronymic',
        ]


class EntrantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrant
        fields = "__all__"

    citizenship = serializers.SlugRelatedField(
        slug_field="name",
        queryset=CitizenshipList.objects.all()
    )

    qualification = serializers.SlugRelatedField(
        slug_field="name",
        queryset=Qualification.objects.all()
    )

    nationality = serializers.SlugRelatedField(
        slug_field="name",
        queryset=Nationality.objects.all()
    )

    quota = serializers.SlugRelatedField(
        many=True,
        slug_field="name",
        queryset=Quota.objects.all()
    )

    how_found_out_about_college = serializers.SlugRelatedField(
        many=True,
        slug_field="information_source",
        read_only=True
    )

    how_found_out_about_college_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=HowFoundOut.objects.all(),
        source='how_found_out_about_college',
        write_only=True
    )


    previous_place_of_study = PreviousPlaceOfStudyLabelSerializer(read_only=True)
    previous_place_of_study_id = serializers.PrimaryKeyRelatedField(
        queryset=PreviousPlaceOfStudy.objects.all(),
        source='previous_place_of_study',
        write_only=True
    )

    parents = ParentsForEntrantSerializer(many=True, read_only=True)
    parent_ids = serializers.PrimaryKeyRelatedField(
        queryset=Parent.objects.all(),
        many=True,
        write_only=True
    )

    def get_previous_place_of_study(self, obj):
        place = obj.previous_place_of_study
        if place:
            type_name = place.previous_place_of_study_type.name if place.previous_place_of_study_type else "Без типа"
            return f"{place.name} - {type_name}"
        return None

    language_of_study = serializers.SlugRelatedField(
        slug_field='name',
        queryset=LanguageOfStudy.objects.all()
    )



    def create(self, validated_data):
        parent_ids = validated_data.pop("parent_ids", [])
        quota_ids = validated_data.pop('quota', [])
        how_found_out_ids = validated_data.pop('how_found_out_about_college', [])
        previous_place_of_study = validated_data.pop('previous_place_of_study', None)

        entrant = Entrant.objects.create(**validated_data)

        if parent_ids:
            entrant.parents.set(parent_ids)
        if quota_ids:
            entrant.quota.set(quota_ids)
        if how_found_out_ids:
            entrant.how_found_out_about_college.set(how_found_out_ids)
        if previous_place_of_study:
            entrant.previous_place_of_study = previous_place_of_study
            entrant.save()

        return entrant

    def update(self, instance, validated_data):
        parent_ids = validated_data.pop("parent_ids", None)
        quota_ids = validated_data.pop('quota', None)
        how_found_out_ids = validated_data.pop('how_found_out_about_college', None)
        previous_place_of_study = validated_data.pop('previous_place_of_study', None)

        if parent_ids is not None:
            instance.parents.set(parent_ids)

        if quota_ids is not None:
            instance.quota.set(quota_ids)

        if how_found_out_ids is not None:
            instance.how_found_out_about_college.set(how_found_out_ids)

        if previous_place_of_study is not None:
            instance.previous_place_of_study = previous_place_of_study

        return super().update(instance, validated_data)


class CitizenshipListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CitizenshipList
        fields = "__all__"


class NationalityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nationality
        fields = "__all__"


class CollegeGrantSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = "__all__"


class QualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qualification
        fields = "__all__"

    specialty = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Specialty.objects.all()
    )

class AdmissionsGrantSerializer(serializers.ModelSerializer):
    actual = serializers.IntegerField(read_only=True)
    fulfilled_percent = serializers.FloatField(read_only=True)
    qualification = QualificationSerializer()
    previous_place_of_study_type = PreviousPlaceOfStudyTypeSerializer()

    class Meta:
        model = AdmissionsGrant
        fields = [
            'id',
            'college',
            'qualification',
            'previous_place_of_study_type',
            'places',
            'actual',
            'fulfilled_percent',
        ]
