#!/bin/sh

CURRENT_DIRECTORY="$(dirname $(readlink -f "$0"))"
PROJECT_DIR="$CURRENT_DIRECTORY/project"
HTACCESS="$PROJECT_DIR/.htaccess"
PULL=$( cd "$CURRENT_DIRECTORY" && git pull)
LOG_DIR="$CURRENT_DIRECTORY/../logs/autodeploy/"
LOG_FILE="$LOG_DIR"$(date "+%Y-%m-%d")".log"

if [ "$PULL" != "Already up to date." ]
then

  if ! [ -d "$PROJECT_DIR" ]
  then
    mkdir -p "$PROJECT_DIR"

    if [ -d "$PROJECT_DIR" ]
    then
      echo "Каталог $PROJECT_DIR успешно создан"
    else
      echo "Не удалось создать каталог $PROJECT_DIR"
    fi

  else
    echo "Каталог $PROJECT_DIR существует"
  fi

  if ! [ -d "$LOG_DIR" ]
  then
    mkdir -p "$LOG_DIR"

    if [ -d "$LOG_DIR" ]
    then
      echo "Директория $LOG_DIR успешно создана"
    else
      echo "Не удалось создать директорию $LOG_DIR"
    fi

    else
      echo "Директория $LOG_DIR существует"
    fi

  cd "$CURRENT_DIRECTORY" && npm install
  cd "$CURRENT_DIRECTORY" && npm run format
  cd "$CURRENT_DIRECTORY" && npm run build
  chmod 777 -R "$CURRENT_DIRECTORY"

  cd "$CURRENT_DIRECTORY" && git add .
  cd "$CURRENT_DIRECTORY" && git commit -am 'Fix in server'
  cd "$CURRENT_DIRECTORY" && git push

    if ! [ -f "$LOG_FILE" ]
    then
      touch "$LOG_FILE"

      if [ -d "$LOG_DIR" -a -f "$LOG_FILE" ]
      then
        echo "$(date "+%Y-%m-%d %H:%M:%S")" >> "$LOG_FILE"
        echo "Файл $LOG_FILE существует"
      else
        echo "Не удалось создать файл лога"
      fi

    else
        echo "$(date "+%Y-%m-%d %H:%M:%S")" >> "$LOG_FILE"
        echo "Запись о выполнении добавлена в журнал"
    fi
fi

echo "
User-agent: *
Disallow: /

" > "$PROJECT_DIR/robots.txt"

echo "
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

" > "$HTACCESS"
