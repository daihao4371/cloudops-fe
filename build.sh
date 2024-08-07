tar zvcf big-devops_front_`date "+%Y-%m-%d"`.tar.gz   --exclude=big-devops/node_modules big-devops
tar zvcf big-devops.tar.gz   --exclude=big-devops/node_modules --exclude=big-devops/.git big-devops


# 跳过校验
 git commit --no-verify



docker build -t 192.168.0.81:30002/devops/bigdevops-fe:v1.0.0  .


docker run --rm    -p 8080:80 --name bigdevops-fe 192.168.0.81:30002/devops/bigdevops-fe:v1.0.0


docker tag 192.168.0.81:30002/devops/bigdevops-fe:v1.0.0 registry.cn-beijing.aliyuncs.com/ning1875_haiwai_image/bigdevops-fe:v1.0.0
