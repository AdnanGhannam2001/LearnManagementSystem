#!/bin/bash

PS3="Select an option: "
options=("Seed users" "Quit")

select choice in "${options[@]}"
do
    case $choice in
        "Seed users")
            echo "Seeding users..."
            yarn ts-node ./libs/database/src/seeds/users.seed.ts
            break
            ;;
        "Quit")
            echo "Exiting..."
            break
            ;;
        *)
            echo "Invalid option"
            ;;
    esac
done
