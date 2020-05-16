FROM openapitools/openapi-generator-cli
VOLUME /local
WORKDIR /local
CMD ["generate", "-i", "src/public/openapi.yaml", "-g", "php", "-o", "src/external/openapigen/models", "-c", "src/openapiconfig.json"]