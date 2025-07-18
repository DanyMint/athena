set -e

echo "🔧 Running makemigrations..."
python src/manage.py makemigrations
echo "🧱 Running migrate..."
python src/manage.py migrate

echo "Running import"
python src/manage.py import_entrants

echo "🚀 Starting dev server..."
python src/manage.py runserver 0.0.0.0:8000
