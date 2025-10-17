import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";

const App: React.FC<{}> = () => {


  return (
    <nav style={{ padding: 12 }}>
      <div style={{marginBottom: 30}}>
        <strong style={{fontSize: 16}}>你好，mc</strong>
      </div>
      <div>
        <Link to="/camera" style={{fontSize: 16}}>开始扫描</Link>
      </div>
    </nav>
  );
};

export default App;
