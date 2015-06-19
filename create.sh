#!/bin/bash

while read date
do
    # fileName=`echo "$date" | tr " " "_"`
    # date="$date 14:00 2013 +0500"
    # echo "Creating file... $fileName"

    echo "$date"
    # touch "$fileName"
    for in {0..50}
    do
      echo $date >> message.txt 
      git add . 
      git commit --date="$date" -m "$date"
    done
    # git add "$fileName"
    # git commit --date="$date" --author="public-contributions" -m "$fileName"
done < dates.txt