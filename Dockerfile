# node 构建
FROM node:16-alpine as build-stage
# 署名
MAINTAINER Adoin 'adoin@qq.com'
WORKDIR /app
COPY . ./
# 设置 node 阿里镜像
#RUN npm config set registry https://registry.npm.taobao.org
#RUN npm config set registry http://registry.npm.taobao.org
RUN npm config set registry https://mirrors.huaweicloud.com/repository/npm/
#RUN #npm config set registry http://mirrors.cloud.tencent.com/npm/

# 设置--max-old-space-size
ENV NODE_OPTIONS=--max-old-space-size=16384
# 设置阿里镜像、pnpm、依赖、编译
#RUN npm config set disturl https://npm.taobao.org/dist --global
RUN npm config get registry

# 设置--max-old-space-size
ENV NODE_OPTIONS=--max-old-space-size=16384
# 设置阿里镜像、pnpm、依赖、编译
#RUN npm cache clean --force
RUN npm config set strict-ssl false
RUN npm install --verbose  pnpm -g
RUN pnpm install --verbose --frozen-lockfile
RUN pnpm build:docker

# node部分结束
RUN echo "🎉 编 🎉 译 🎉 成 🎉 功 🎉"
# nginx 部署
FROM nginx:1.23.3-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html/dist
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
## 将/usr/share/nginx/html/dist/assets/index.js 和/usr/share/nginx/html/dist/_app.config.js中的"$vg_base_url"替换为环境变量中的VG_BASE_URL,$vg_sub_domain 替换成VG_SUB_DOMAIN，$vg_default_user替换成VG_DEFAULT_USER，$vg_default_password替换成VG_DEFAULT_PASSWORD 而后启动nginx
CMD sed -i "s|__vg_base_url|$VG_BASE_URL|g" /usr/share/nginx/html/dist/assets/index.js && \
    sed -i "s|__vg_base_url|$VG_BASE_URL|g" /usr/share/nginx/html/dist/_app.config.js && \
    nginx -g 'daemon off;'
RUN echo "🎉 架 🎉 设 🎉 成 🎉 功 🎉"
