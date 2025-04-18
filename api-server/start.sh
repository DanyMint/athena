set -e 

echo "🔧 Running makemigrations..."
python src/manage.py makemigrations
echo "🧱 Running migrate..."
python src/manage.py migrate

echo "🚀 Starting Gunicorn..."
exec gunicorn -c "gunicorn_config.py" core.wsgi
