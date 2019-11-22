-include .config.mk

HEAD   := $(shell git log | head -n1 | cut -d' ' -f2 | cut -b-20)
BRANCH := $(shell git branch | grep -e '^\*' | cut -d' ' -f2 | sed s@/@_@g)
DATE   := $(shell date +'%Y-%m-%d-%H-%M-%S')


LABEL   :=ac-web.custom.$(BRANCH).$(HEAD).$(DATE)
ZIPNAME :=$(LABEL).zip

S3_BUCKET := codeship-builds

DIST=dist


build: webpack server-copy


dev:
	withenv npm run start-dev

server-dev:
	withenv ./node_modules/.bin/nodemon server/app-server-dev.js

prod:
	withenv bash -c 'cd dist && PORT=9000 npm --production start'

clean:
	- rm -rf dist
	- rm ac-web.custom.*.zip

webpack:
	NODE_ENV=production ./node_modules/.bin/webpack --config ./webpack.production.config.js --progress --profile --colors --bail

webpack-dev:
	NODE_ENV=production ./node_modules/.bin/webpack --config ./webpack.development.config.js --progress --profile --colors --bail

zip: build
	cd dist && zip -r ../$(ZIPNAME) *
	cd dist && zip -r ../$(ZIPNAME) .ebextensions

push-dev: zip
	aws --profile=$(AWS_PROFILE) s3 cp $(ZIPNAME) s3://$(S3_BUCKET)/$(ZIPNAME)

	aws elasticbeanstalk create-application-version \
	  --profile $(AWS_PROFILE) \
	  --region us-west-2 \
	  --application-name avalanche-canada \
	  --version-label $(LABEL) \
	  --source-bundle S3Bucket=$(S3_BUCKET),S3Key=$(ZIPNAME) \
	  --description 'custom git build'

	aws elasticbeanstalk update-environment \
	  --profile $(AWS_PROFILE) \
	  --region us-west-2 \
	  --environment-name avalanche-canada-dev \
	  --version-label "$(LABEL)"

	echo pushed to http://dev.avalanche.ca/


push-qa: zip
	aws --profile=$(AWS_PROFILE) s3 cp $(ZIPNAME) s3://$(S3_BUCKET)/$(ZIPNAME)

	aws elasticbeanstalk create-application-version \
	  --profile $(AWS_PROFILE) \
	  --region us-west-2 \
	  --application-name avalanche-canada \
	  --version-label $(LABEL) \
	  --source-bundle S3Bucket=$(S3_BUCKET),S3Key=$(ZIPNAME) \
	  --description 'custom git build'

	aws elasticbeanstalk update-environment \
	  --profile $(AWS_PROFILE) \
	  --region us-west-2 \
	  --environment-name avalanche-canada-qa \
	  --version-label "$(LABEL)"

	echo pushed to http://qa.avalanche.ca/


server-copy:
	cp client/favicon.ico $(DIST)/public
	cp client/.htaccess $(DIST)/public
	cp package.json $(DIST)
	cp -R server $(DIST)
	cp -R .ebextensions $(DIST)

DEV_PURGE_COUNT=50

purge-dev-builds:
	aws --profile=$(AWS_PROFILE)                       \
	    elasticbeanstalk describe-application-versions \
	    --application-name avalanche-canada            \
	    --query='ApplicationVersions[].[VersionLabel, to_string(to_array(Description))]' \
	    --output text                                  \
	 | grep 'custom git build'    \
	 | cut -f1                    \
	 | tail -n $(DEV_PURGE_COUNT) \
	 | xargs -t -n1 -I{} aws elasticbeanstalk delete-application-version --profile $(AWS_PROFILE) --application-name avalanche-canada --version-label {}

purge-all-builds:
	aws --profile=$(AWS_PROFILE)                       \
	    elasticbeanstalk describe-application-versions \
	    --application-name avalanche-canada            \
	    --query='ApplicationVersions[].[VersionLabel, to_string(to_array(Description))]' \
	    --output text                                  \
	| cut -f1                  \
	| tail -n 10               \
	| xargs -t -n1 -I{} aws elasticbeanstalk delete-application-version --profile $(AWS_PROFILE) --application-name avalanche-canada --version-label {}


test-swagger:
	./node_modules/.bin/swagger-cli validate server/api/docs/swagger.yaml

.PHONY: build prod webpack webpack-dev clean zip clean push-dev server-copy test purge-dev-builds server-dev test-swagger

test:
	npm run test -- -u
