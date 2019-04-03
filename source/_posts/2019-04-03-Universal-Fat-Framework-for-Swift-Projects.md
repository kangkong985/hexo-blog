---
title: Universal(Fat) Framework for Swift Projects
tags:
  - ios
  - swift
  - 教程
categories:
  - 教程
abbrlink: 28461
date: 2019-04-03 11:41:42
---
![Cocoa Touch Framework](https://imgs.codewoody.com/uploads/big/ec2894c1da024327344a0c2fb0f0e55a.jpg)

最近在给朋友做一个项目，要求将涉及到的算法内容整理成一个单独的framework，这样可以隐藏算法细节，方便交付。这个需求可以很容易地通过[Cocoa Touch Framework](https://medium.com/@Rageeni16/create-cocoa-touch-framework-and-publish-it-be9ad6535f33)实现。不过在交付的时候存在一个头疼的问题：默认情况下，Xcode在编译Cocoa Touch Framework时只会编译出支持模拟器或者真机的Framework，而无法编译出同时支持模拟器和真机的Framework，即Universal(Fat) Framework。这一需求还需要进一步地利用一些系统脚本来实现。
<!--more-->

这里假设你已经有了一个能够正常工作，编译的包含Cocoa Touch Framework的工程。我这里实现时使用的是Xcode10.2。

> 事实上我在调研中发现了很多不同的实现编译Universal Framework的教程，但是他们并不总是有用，我这里只遴选了我自己测试通过没有问题的思路。这一思路通过Archive过程来打包输出framework

首先从Xcode左上角选择Cocoa Touch Framework的默认scheme，然后点击Edit Scheme

![Edit Scheme](https://imgs.codewoody.com/uploads/big/c98bd864a870a5fa23da8ec4b330fd51.png)

在Archive的post-action中添加一个运行脚本(New Run Script Action)

![New Run Script Action](https://imgs.codewoody.com/uploads/big/8928535c1633ad1bfab117bd46b5b20c.png)

脚本内容如下：

```bash
exec > /tmp/${PROJECT_NAME}_archive.log 2>&1

UNIVERSAL_OUTPUTFOLDER=${BUILD_DIR}/${CONFIGURATION}-universal

if [ "true" == ${ALREADYINVOKED:-false} ]
then
echo "RECURSION: Detected, stopping"
else
export ALREADYINVOKED="true"

# make sure the output directory exists
mkdir -p "${UNIVERSAL_OUTPUTFOLDER}"

echo "Building for iPhoneSimulator"
xcodebuild -workspace "${WORKSPACE_PATH}" -scheme "${TARGET_NAME}" -configuration ${CONFIGURATION} -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 6' ONLY_ACTIVE_ARCH=NO ARCHS='i386 x86_64' BUILD_DIR="${BUILD_DIR}" BUILD_ROOT="${BUILD_ROOT}" ENABLE_BITCODE=YES OTHER_CFLAGS="-fembed-bitcode" BITCODE_GENERATION_MODE=bitcode clean build

# Step 1. Copy the framework structure (from iphoneos build) to the universal folder
echo "Copying to output folder"
# 这行是在我参考的脚本的基础上添加进去的。脚本在运行过程中有一个问题：在试图将
# archive过程中生成的device framework拷贝进来时，总是拷贝的framework文件夹
# 的内容，而非整个文件夹，所以我们这里手动创建这个文件夹
mkdir -p "${UNIVERSAL_OUTPUTFOLDER}/${FULL_PRODUCT_NAME}"
cp -R "${ARCHIVE_PRODUCTS_PATH}${INSTALL_PATH}/${FULL_PRODUCT_NAME}" "${UNIVERSAL_OUTPUTFOLDER}/${FULL_PRODUCT_NAME}"

# Step 2. Copy Swift modules from iphonesimulator build (if it exists) to the copied framework directory
SIMULATOR_SWIFT_MODULES_DIR="${BUILD_DIR}/${CONFIGURATION}-iphonesimulator/${TARGET_NAME}.framework/Modules/${TARGET_NAME}.swiftmodule/."
echo "SIMULATOR_SWIFT_MODULES_DIR: ${SIMULATOR_SWIFT_MODULES_DIR}"
if [ -d "${SIMULATOR_SWIFT_MODULES_DIR}" ]; then
cp -R "${SIMULATOR_SWIFT_MODULES_DIR}" "${UNIVERSAL_OUTPUTFOLDER}/${TARGET_NAME}.framework/Modules/${TARGET_NAME}.swiftmodule"
fi

# Step 3. Create universal binary file using lipo and place the combined executable in the copied framework directory
echo "Combining executables"
lipo -create -output "${UNIVERSAL_OUTPUTFOLDER}/${FULL_PRODUCT_NAME}/${EXECUTABLE_PATH}" "${BUILD_DIR}/${CONFIGURATION}-iphonesimulator/${EXECUTABLE_PATH}" "${ARCHIVE_PRODUCTS_PATH}${INSTALL_PATH}/${EXECUTABLE_PATH}"

# Step 4. Create universal binaries for embedded frameworks
#for SUB_FRAMEWORK in $( ls "${UNIVERSAL_OUTPUTFOLDER}/${TARGET_NAME}.framework/Frameworks" ); do
#BINARY_NAME="${SUB_FRAMEWORK%.*}"
#lipo -create -output "${UNIVERSAL_OUTPUTFOLDER}/${TARGET_NAME}.framework/Frameworks/${SUB_FRAMEWORK}/${BINARY_NAME}" "${BUILD_DIR}/${CONFIGURATION}-iphonesimulator/${SUB_FRAMEWORK}/${BINARY_NAME}" "${ARCHIVE_PRODUCTS_PATH}${INSTALL_PATH}/${TARGET_NAME}.framework/Frameworks/${SUB_FRAMEWORK}/${BINARY_NAME}"
#done

# Step 5. Convenience step to copy the framework to the project's directory
echo "Copying to project dir"
yes | cp -Rf "${UNIVERSAL_OUTPUTFOLDER}/${FULL_PRODUCT_NAME}" "${PROJECT_DIR}"

open "${PROJECT_DIR}"

fi
```

> 上述脚本的内容主要来自于[export-fat-swift-dynamic-framework](https://gist.github.com/eladnava/0824d08da8f99419ef2c7b7fb6d4cc78)，我在这里根据实际情况进行了更改

此时执行archive操作(Product->Archive)完成后会自动弹出Finder窗口显示新生成的framework的位置（应当就是位于项目根目录下）。