#!/bin/bash

if mkdir ./backend/src/front 2>/dev/null; then
  echo "Napravljen folder front."
else
  echo "Folder front vec postoji."
fi

cd ./frontend
npm run build_copy
cd ../backend
npm run start