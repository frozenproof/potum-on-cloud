name: "poc"
services:
  poc:
    build:
      context: .
      dockerfile: Dockerfile
    image: poc
    container_name: poc    # Custom container name, remove if needed to do anything else, this locks the container as per the document
    ports:
      - "5000:5000"
    volumes:
      - ./images:/app/images           # Mount images folder
      - ./database:/app/database       # Mount database folder
      - ./templates:/app/templates     # Mount templates folder
