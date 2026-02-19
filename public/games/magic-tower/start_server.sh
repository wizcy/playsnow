#!/bin/bash
# 启动本地HTTP服务器用于测试H5游戏

echo "================================"
echo "魔塔H5版本 - 本地测试服务器"
echo "================================"
echo ""

# 检查Python3是否安装
if command -v python3 &> /dev/null
then
    echo "使用Python3启动HTTP服务器..."
    echo "访问地址: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null
then
    echo "使用Python启动HTTP服务器..."
    echo "访问地址: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python -m SimpleHTTPServer 8000
else
    echo "错误: 未找到Python，请安装Python后再试"
    echo "或者使用其他HTTP服务器，如: npx http-server -p 8000"
    exit 1
fi
