prod-conf = docker-compose-prod.yaml
dev-conf = docker-compose-dev.yaml

dev: clean
	docker-compose -f $(dev-conf) up --build

clean-dev:
	docker-compose -f $(dev-conf) down

prod: clean
	docker-compose -f $(prod-conf) up --build --exit-code-from app

clean-prod:
	docker-compose -f $(prod-conf) down

clean: clean-prod clean-dev
