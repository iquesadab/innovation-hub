#!/bin/bash

# Archivo README
README="README.md"

# Archivo temporal
TEMP="tabla_temp.md"

# Genera la tabla de commits
{
    echo "| # | Fecha | Hash | Mensaje |"
    echo "|---|-------|------|---------|"

    git log --reverse --date=short --pretty=format:"%ad|%h|%s" \
    | nl -w1 -s'|' \
    | awk -F'|' '{print "| " $1 " | " $2 " | " $3 " | " $4 " |"}'

} > "$TEMP"

# Reemplaza solo lo que está entre los comentarios
awk '
/<!-- INICIO TABLA COMMITS -->/ {
    print
    while ((getline linea < "tabla_temp.md") > 0) {
        print linea
    }
    dentro=1
    next
}

/<!-- FIN TABLA COMMITS -->/ {
    dentro=0
}

!dentro {
    print
}
' "$README" > README_TEMP.md

# Reemplaza el README original
mv README_TEMP.md "$README"

# Elimina el archivo temporal
rm "$TEMP"

echo "Tabla de commits actualizada correctamente."