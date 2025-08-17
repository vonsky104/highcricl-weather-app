IMAGE_NAME=highcircl-weather-app
CONTAINER_NAME=highcircl-weather-app
PORT=3000

build:
	docker build -t $(IMAGE_NAME) .

serve: build
	docker run --rm -it -p $(PORT):3000 --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop:
	-docker stop $(CONTAINER_NAME)

clean:
	docker image prune -f