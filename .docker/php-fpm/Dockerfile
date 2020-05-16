FROM php:7.1-fpm

RUN apt-get update && apt-get install -y --no-install-recommends \
        git \
        wget \
        zip \
        unzip \
        curl \
        gnupg2 \
        libzip-dev \
        libxml2-dev \
        libpq-dev \
        libssh-dev \
        zlib1g-dev \
        libpng-dev \
        libjpeg-dev \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
    && docker-php-ext-install \
        zip \
        soap \
        bcmath

RUN usermod -u 1000 www-data

RUN rm -rf /var/lib/apt/lists/ && curl -sL "https://deb.nodesource.com/setup_12.x" | bash -
RUN apt-get install nodejs -y

RUN docker-php-ext-configure gd \
    --enable-gd-native-ttf \
    --with-jpeg-dir=/usr/lib \
    --with-freetype-dir=/usr/include/freetype2 && \
    docker-php-ext-install gd

RUN php -r "readfile('http://getcomposer.org/installer');" | php -- --install-dir=/usr/bin/ --filename=composer

WORKDIR "/var/www"