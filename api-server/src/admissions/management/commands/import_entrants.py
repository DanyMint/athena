from django.core.management.base import BaseCommand
from admissions.tools.hard_code_import_entrants import import_zayavki_from_csv

class Command(BaseCommand):
    help = "Import Entrants from .csv"

    def handle(self, *args, **options):
        import_zayavki_from_csv()
