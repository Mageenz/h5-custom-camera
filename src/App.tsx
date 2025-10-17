import React, { useEffect, useRef, useState } from 'react';

import 'lib-flexible';

import 'antd-mobile/dist/antd-mobile.css'; // or 'antd-mobile/dist/antd-mobile.less'
import 'antd/dist/antd.css';
import { showLoading, hideLoading, showFail, showSuccess } from './utils/toast';
import styles from './index.module.scss';
import { CameraOutlined, PictureOutlined } from '@ant-design/icons';
import { startCompress } from './utils/compressBase64';
import { getUserMediaStream } from './utils/getUserMediaStream';

const App: React.FC<{}> = () => {
  const [videoHeight, setVideoHeight] = useState(0);
  const [fileList, setFileList] = useState<string[]>([]);
  const ref = useRef<number | null>(null);
  const [lightValue, setLightValue] = useState(0);

  useEffect(() => {
    const v: any = document.getElementById('video');
    const rectangle = document.getElementById('capture-rectangle');
    const container = document.getElementById('container');
    const _canvas = document.createElement('canvas');

    _canvas.style.display = 'block';

    if (!v) {
      return;
    }
    const video: HTMLVideoElement = v;

    getUserMediaStream(video)
      .then((stream) => {
        setVideoHeight(video.offsetHeight);

        getLight();
        // startCapture();
      })
      .catch((err) => {
        console.log(`err:${err}`);
        
        showFail({
          text: '无法调起后置摄像头，请点击相册，手动上传身份证',
          duration: 6,
        });
      });

    function getLight() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
    
      setInterval(() => {
        canvas.width = video.videoWidth / 4;   // 降低分辨率加速计算
        canvas.height = video.videoHeight / 4;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
        let sum = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          sum += luminance;
        }
    
        const avg = sum / (pixels.length / 4);

        setLightValue(avg);
        console.log('估算环境亮度 (0-255):', avg);
    
        if (avg < 50) {
          console.log('环境光：黑暗');
        } else if (avg < 120) {
          console.log('环境光：昏暗');
        } else if (avg < 200) {
          console.log('环境光：正常室内');
        } else {
          console.log('环境光：很亮');
        }
      }, 1000);
    }

    /**
     * 获取video中对应的真实size
     */
    function getRealSize() {
      const { videoHeight: vh, videoWidth: vw, offsetHeight: oh, offsetWidth: ow } = video;

      return {
        getHeight: height => {
          return (vh / oh) * height;
        },
        getWidth: width => {
          return (vw / ow) * width;
        },
      };
    }

    function isChildOf(child, parent) {
      var parentNode;
      if (child && parent) {
        parentNode = child.parentNode;
        while (parentNode) {
          if (parent === parentNode) {
            return true;
          }
          parentNode = parentNode.parentNode;
        }
      }
      return false;
    }

    function startCapture() {
      ref.current = window.setInterval(() => {
        const { getHeight, getWidth } = getRealSize();
        if (!rectangle) {
          return;
        }
        /** 获取框的位置 */
        const { left, top, width, height } = rectangle.getBoundingClientRect();

        /** 测试时预览 */
        if (container && isChildOf(_canvas, container)) {
          container.removeChild(_canvas);
        }
        container?.appendChild(_canvas);

        const context = _canvas.getContext('2d');
        _canvas.width = width;
        _canvas.height = height;

        context?.drawImage(
          video,
          getWidth(left + window.scrollX),
          getHeight(top + window.scrollY),
          getWidth(width),
          getHeight(height),
          0,
          0,
          width,
          height,
        );

        const base64 = _canvas.toDataURL('image/jpeg');
        // TODO 此处可以根据需要调用OCR识别接口
      }, 200);
    }

    /** 防止内存泄露 */
    return () => {
      if (ref.current !== null) {
        clearInterval(ref.current);
      }
    };
  }, []);

  /** 只支持1张图片 */
  function updateUploadFiles(url = '') {
    let files: any[] = [];
    if (url) {
      files = [{ url }];
    }

    setFileList(files);
  }

  const __formatUploadFile2base64AndCompress = file => {
    const handleImgFileBase64 = file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function () {
          resolve(reader.result);
        };
      });
    };

    showLoading();
    handleImgFileBase64(file)
      .then(res => {
        if (file.size > 750 * 1334) {
          showLoading('图片压缩中...');
          return startCompress(res);
        } else {
          return res;
        }
      })
      .then(res => {
        hideLoading();
        updateUploadFiles();
        // TODO 上传
        showSuccess({
          text: '上传成功!',
        });
      })
      .catch(err => {
        console.error(err);
        hideLoading();
        showFail({
          text: '上传失败',
        });
      });
  };

  const onChangeFile = event => {
    const files = event.target.files;
    if (files?.[0]) {
      __formatUploadFile2base64AndCompress(files[0]);
    }
  };

  const customUploadProps = {
    onChange: onChangeFile,
    accept: 'image/jpeg,image/jpg,image/png',
    files: fileList,
  };

  /**
   * 从本地上传
   */
  const CustomUpload = customUploadProps => (
    <input className={styles['input']} type="file" {...customUploadProps} />
  );

  const [captureBase64, setCaptureBase64] = useState('');
  const handleCapture = () => {
    console.log('handleCapture');

    const v: any = document.getElementById('video');
    const rectangle = document.getElementById('capture-rectangle');
    const _canvas = document.createElement('canvas');

    const video: HTMLVideoElement = v;

    /**
     * 获取video中对应的真实size
     */
    function getRealSize() {
      const { videoHeight: vh, videoWidth: vw, offsetHeight: oh, offsetWidth: ow } = video;

      return {
        getHeight: height => {
          return (vh / oh) * height;
        },
        getWidth: width => {
          return (vw / ow) * width;
        },
      };
    }

    const { getHeight, getWidth } = getRealSize();
    if (!rectangle) {
      return;
    }
    /** 获取框的位置 */
    const { left, top, width, height } = rectangle.getBoundingClientRect();

    /** 测试时预览 */
    // if (isChildOf(_canvas, container)) {
    //     container.removeChild(_canvas);
    // }
    // container.appendChild(_canvas);

    const context = _canvas.getContext('2d');
    _canvas.width = width;
    _canvas.height = height;

    context?.drawImage(
      video,
      getWidth(left + window.scrollX),
      getHeight(top + window.scrollY),
      getWidth(width),
      getHeight(height),
      0,
      0,
      width,
      height,
    );
    console.log('infos', {
      sx: getWidth(left + window.scrollX),
      sy: getHeight(top + window.scrollY),
      sw: getWidth(width),
      sh: getHeight(height),
      dx: 0,
      dy: 0,
      dw: width,
      dh: height,
    });

    const base64 = _canvas.toDataURL('image/png');
    // console.log('base64', base64);
    setCaptureBase64(base64);
  };

  return (
    <div id="container" className={styles.container}>
      <video
        id="video"
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
        }}
      ></video>

      <div className={styles['shadow-layer']} style={{ height: `${videoHeight}px` }}>
        <div id="capture-rectangle" className={styles['capture-rectangle']}></div>

        {/* <div className={styles['hold-tips']}>hold-tips</div> */}
      </div>

      {/* <div className={styles.tips}>tips</div> */}
      {/* 拍摄按钮 */}
      <div className={styles['capture-button']}>
        <div className={styles['capture-button-icon']} onClick={handleCapture}>
          <CameraOutlined />
        </div>
      </div>

      <div className={styles['gallery-container']}>
        <div style={{color: '#fff'}}>
          <p>亮度值: {lightValue.toFixed(2)}[0-255]</p>
        </div>
        <img src={captureBase64} alt="capture" />
        <CustomUpload {...customUploadProps} />
        {/* <PictureOutlined className={styles['icon']} /> */}
      </div>
    </div>
  );
};

export default App;
