#!/bin/bash
FOLDER=$1
PROJECT=$2
TYPE=$3
KEYWORDS=$4
CONTENT=$5
echo "---
PROJECT: $PROJECT
TYPE: $TYPE
KEYWORDS: $KEYWORDS
MODEL: $FOLDER
DATE: $(date +%F)
---
$CONTENT" > "$FOLDER/$PROJECT.js"
git add .
git commit -m "Auto-sync: $PROJECT"
git push -u origin main
echo "✅ SYNCED: $PROJECT SAVED IN $FOLDER"
