import React, { useState } from "react";
import { Card, Popup, Image, Button } from "antd-mobile";
import { 
  SafetyCertificateOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  ExpandOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import "./styles/global.css";
import "./styles/home.scss";

const App: React.FC<{}> = () => {
  // 模拟历史校验数据
  const [verificationStats] = useState({
    total: 1247,
    verified: 1089,
    failed: 158,
    today: 23,
    warning: 10
  });

  // Popup 和筛选状态
  const [popupVisible, setPopupVisible] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "verified" | "failed" | "today">("all");
  const [imageVisible, setImageVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  // 模拟历史记录数据
  const [historyRecords] = useState([
    {
      id: "VRF-2025-1024-001",
      name: "张三的电子签名",
      timestamp: "2025-10-24 14:32:15",
      status: "verified",
      confidence: 96.8,
      type: "电子签名",
      imageUrl: "https://images.unsplash.com/photo-1676312389476-fe01e238b422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduYXR1cmUlMjBkb2N1bWVudHxlbnwxfHx8fDE3NjEyOTA2MjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "VRF-2025-1024-002",
      name: "合同签章-A001",
      timestamp: "2025-10-24 13:45:22",
      status: "verified",
      confidence: 92.5,
      type: "手写签名",
      imageUrl: "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250cmFjdCUyMHNpZ25pbmd8ZW58MXx8fHwxNzYxMjkwNjIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "VRF-2025-1024-003",
      name: "李四签字样本",
      timestamp: "2025-10-24 11:18:09",
      status: "failed",
      confidence: 45.2,
      type: "电子签名",
      imageUrl: "https://images.unsplash.com/photo-1670852714979-f73d21652a83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2lnbmF0dXJlJTIwcGVufGVufDF8fHx8MTc2MTI5MDYyMnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "VRF-2025-1024-004",
      name: "授权书签名",
      timestamp: "2025-10-24 10:05:33",
      status: "verified",
      confidence: 89.3,
      type: "手写签名",
      imageUrl: "https://images.unsplash.com/photo-1627513182299-4bc6693d2cae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHNpZ25hdHVyZXxlbnwxfHx8fDE3NjEyOTA2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "VRF-2025-1023-001",
      name: "王五的签名",
      timestamp: "2025-10-23 16:22:41",
      status: "verified",
      confidence: 94.7,
      type: "电子签名",
      imageUrl: "https://images.unsplash.com/photo-1634562876572-5abe57afcceb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHBlbiUyMHdyaXRpbmd8ZW58MXx8fHwxNzYxMjkwNjIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "VRF-2025-1023-002",
      name: "协议签章",
      timestamp: "2025-10-23 15:10:18",
      status: "failed",
      confidence: 38.9,
      type: "手写签名",
      imageUrl: "https://images.unsplash.com/photo-1676312389476-fe01e238b422?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduYXR1cmUlMjBkb2N1bWVudHxlbnwxfHx8fDE3NjEyOTA2MjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "VRF-2025-1023-003",
      name: "赵六电子签",
      timestamp: "2025-10-23 14:30:55",
      status: "verified",
      confidence: 97.2,
      type: "电子签名",
      imageUrl: "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250cmFjdCUyMHNpZ25pbmd8ZW58MXx8fHwxNzYxMjkwNjIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      id: "VRF-2025-1023-004",
      name: "收据签名验证",
      timestamp: "2025-10-23 09:45:12",
      status: "verified",
      confidence: 91.8,
      type: "手写签名",
      imageUrl: "https://images.unsplash.com/photo-1627513182299-4bc6693d2cae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHNpZ25hdHVyZXxlbnwxfHx8fDE3NjEyOTA2MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ]);

  // 筛选历史记录
  const filteredRecords = historyRecords.filter(record => {
    if (filterType === "verified") return record.status === "verified";
    if (filterType === "failed") return record.status === "failed";
    if (filterType === "today") return record.timestamp.startsWith("2025-10-24");
    return true;
  });

  // 打开历史记录列表
  const openHistory = (type: "all" | "verified" | "failed" | "today") => {
    setFilterType(type);
    setPopupVisible(true);
  };

  // 获取标题文本
  const getPopupTitle = () => {
    switch (filterType) {
      case "verified": return "验证通过记录";
      case "failed": return "验证失败记录";
      case "today": return "今日校验记录";
      default: return "校验历史记录";
    }
  };

  const handleStartVerification = () => {
    console.log("开始校验");
    window.location.href = "/camera";
  };

  // 查看大图
  const viewImage = (url: string) => {
    setCurrentImage(url);
    setImageVisible(true);
  };

  return (
    <div className="app-container">
      {/* Header - 深蓝色渐变背景 */}
      <div className="header-section">
        {/* 装饰性背景元素 */}
        <div className="decoration-circle decoration-circle-1"></div>
        <div className="decoration-circle decoration-circle-2"></div>
        <div className="decoration-ring decoration-ring-1"></div>
        <div className="decoration-ring decoration-ring-2"></div>
        
        {/* 装饰性小圆点 */}
        <div className="decoration-dot decoration-dot-1"></div>
        <div className="decoration-dot decoration-dot-2"></div>
        <div className="decoration-dot decoration-dot-3"></div>

        {/* Header Content */}
        <div className="header-content">
          {/* Logo 和标题 - 水平排列 */}
          <div className="header-title-wrapper">
            <div className="logo-box">
              <SafetyCertificateOutlined style={{ fontSize: '0.56rem', color: '#fff' }} />
            </div>
            <div className="title-text">
              <h1 className="main-title">签名真实性校验</h1>
              <p className="sub-title">快速验证签名的真实性和有效性</p>
            </div>
          </div>
        </div>
      </div>

      {/* 总校验次数卡片 - 一半在头部内，一半在外面 */}
      <div className="total-card-wrapper">
        <Card className="total-stats-card">
          <div className="total-stats-content" onClick={() => openHistory("all")}>
            <p className="stats-label">累计校验次数</p>
            <div className="stats-value-wrapper">
              <span className="stats-value">{verificationStats.total.toLocaleString()}</span>
              <span className="stats-unit">次</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content - 统计信息 */}
      <div className="main-content">
        {/* 详细统计网格 */}
        <div className="stats-grid">
          <Card 
            className="stat-card stat-card-success"
            onClick={() => openHistory("verified")}
          >
            <div className="stat-icon-wrapper stat-icon-success">
              <CheckCircleOutlined style={{ fontSize: '0.4rem', color: '#16a34a' }} />
            </div>
            <div className="stat-value stat-value-success">
              {verificationStats.verified}
            </div>
            <p className="stat-label">验证通过</p>
          </Card>

          <Card 
            className="stat-card stat-card-error"
            onClick={() => openHistory("failed")}
          >
            <div className="stat-icon-wrapper stat-icon-error">
              <CloseCircleOutlined style={{ fontSize: '0.4rem', color: '#dc2626' }} />
            </div>
            <div className="stat-value stat-value-error">
              {verificationStats.failed}
            </div>
            <p className="stat-label">验证失败</p>
          </Card>

          <Card 
            className="stat-card stat-card-info"
            onClick={() => openHistory("today")}
          >
            <div className="stat-icon-wrapper stat-icon-info">
              <ClockCircleOutlined style={{ fontSize: '0.4rem', color: '#2563eb' }} />
            </div>
            <div className="stat-value stat-value-info">
              {verificationStats.today}
            </div>
            <p className="stat-label">今日校验</p>
          </Card>
          <Card className="stat-card stat-card-warning">
            <div className="stat-icon-wrapper stat-icon-warning">
              <ExclamationCircleOutlined style={{ fontSize: '0.4rem', color: '#f59e0b' }} />
            </div>
            <div className="stat-value stat-value-warning">
              {verificationStats.warning}
            </div>
            <p className="stat-label">待验证</p>
          </Card>
        </div>

        {/* 功能说明卡片 */}
        <Card className="info-card">
          <div className="info-card-content">
            <div className="info-icon">💡</div>
            <div className="info-text">
              <h3 className="info-title">校验说明</h3>
              <p className="info-desc">
                支持多种签名格式验证，包括电子签名、手写签名等。系统将自动分析签名特征并给出真实性评估结果。点击上方统计卡片可查看对应的历史记录。
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 历史记录 Popup - 从底部滑出 */}
      <Popup
        visible={popupVisible}
        onMaskClick={() => setPopupVisible(false)}
        position="bottom"
        bodyStyle={{ 
          height: '85vh',
          borderTopLeftRadius: '0.32rem',
          borderTopRightRadius: '0.32rem'
        }}
      >
        <div className="popup-container">
          <div className="popup-header">
            <h2 className="popup-title">{getPopupTitle()}</h2>
          </div>
          
          <div className="popup-content">
            {filteredRecords.length === 0 ? (
              <div className="empty-state">暂无记录</div>
            ) : (
              <div className="records-list">
                {filteredRecords.map((record) => (
                  <Card key={record.id} className="record-card">
                    <div className="record-content">
                      {/* 缩略图 */}
                      <div 
                        className="record-thumbnail"
                        onClick={() => viewImage(record.imageUrl)}
                      >
                        <img 
                          src={record.imageUrl}
                          alt={record.name}
                          className="thumbnail-img"
                        />
                        <div className="thumbnail-overlay">
                          <ExpandOutlined style={{ fontSize: '0.4rem', color: '#fff' }} />
                        </div>
                      </div>

                      {/* 记录信息 */}
                      <div className="record-info">
                        <div className="record-header">
                          <div className="record-name-wrapper">
                            <h4 className="record-name">{record.name}</h4>
                            <p className="record-id">{record.id}</p>
                          </div>
                          <span className={`record-badge ${record.status === 'verified' ? 'badge-success' : 'badge-error'}`}>
                            {record.status === 'verified' ? '通过' : '失败'}
                          </span>
                        </div>
                        
                        <div className="record-time">
                          <ClockCircleOutlined style={{ fontSize: '0.24rem', marginRight: '0.08rem' }} />
                          {record.timestamp}
                        </div>

                        <div className="record-footer">
                          <span className="record-type">{record.type}</span>
                          <div className="record-confidence">
                            <span className="confidence-label">可信度：</span>
                            <span className={`confidence-value ${record.status === 'verified' ? 'confidence-success' : 'confidence-error'}`}>
                              {record.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Popup>

      {/* 图片查看器 */}
      {/* <Image.Viewer
        image={currentImage}
        visible={imageVisible}
        onClose={() => setImageVisible(false)}
      /> */}

      {/* Fixed Bottom Button - 开始校验按钮 */}
      <div className="fixed-button-wrapper">
        <Button 
          color="primary"
          size="large"
          block
          className="start-button"
          onClick={handleStartVerification}
        >
          <SafetyCertificateOutlined style={{ fontSize: '0.4rem', marginRight: '0.16rem' }} />
          开始校验签名
        </Button>
      </div>
    </div>
  );
}

export default App;