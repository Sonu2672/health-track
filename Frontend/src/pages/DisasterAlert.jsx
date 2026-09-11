import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

import "../css/disaster.css";
import Sidebar from "../components/Sidebar";

import { useNavigate } from "react-router-dom";

import {
  AlertTriangle,
  Flame,
  Waves,
  Wind,
  CloudRain,
  Activity,
  MapPin,
  Clock,
  RefreshCw,
  ShieldAlert,
  ChevronRight,
  PhoneCall,
  Bot,
  X,
  Send,
  Wifi,
  WifiOff,
  Sparkles,
  Menu,
  ArrowLeft,
} from "lucide-react";

// =====================================================
// BIHAR DISTRICTS
// =====================================================

const biharDistricts = [
  "All Bihar",
  "Araria",
  "Arwal",
  "Aurangabad",
  "Banka",
  "Begusarai",
  "Bhagalpur",
  "Bhojpur",
  "Buxar",
  "Darbhanga",
  "East Champaran (Motihari)",
  "Gaya",
  "Gopalganj",
  "Jamui",
  "Jehanabad",
  "Kaimur (Bhabua)",
  "Katihar",
  "Khagaria",
  "Kishanganj",
  "Lakhisarai",
  "Madhepura",
  "Madhubani",
  "Munger",
  "Muzaffarpur",
  "Nalanda",
  "Nawada",
  "Patna",
  "Purnia",
  "Rohtas",
  "Saharsa",
  "Samastipur",
  "Saran (Chhapra)",
  "Sheikhpura",
  "Sheohar",
  "Sitamarhi",
  "Siwan",
  "Supaul",
  "Vaishali (Hajipur)",
  "West Champaran (Bettiah)",
];

// =====================================================
// DISASTER CONFIG
// =====================================================

const disasterConfig = {
  earthquake: {
    icon: Activity,
    classKey: "type-earthquake",
  },

  flood: {
    icon: Waves,
    classKey: "type-flood",
  },

  cyclone: {
    icon: Wind,
    classKey: "type-cyclone",
  },

  wildfire: {
    icon: Flame,
    classKey: "type-wildfire",
  },

  heavy_rain: {
    icon: CloudRain,
    classKey: "type-flood",
  },

  default: {
    icon: AlertTriangle,
    classKey: "type-default",
  },
};

// =====================================================
// OFFLINE KNOWLEDGE BASE
// =====================================================

const offlineKnowledgeBase = [
  {
    keywords: ["flood", "baadh", "paani", "water"],

    response:
      "Flood Safety (Offline):\n1. Unche sthan par jayein.\n2. Main electrical switch band karein.\n3. Dry food & saaf paani pass rakhein.\n4. Bihar SDMA Control Room: 0612-2217357 / 1070.",
  },

  {
    keywords: [
      "earthquake",
      "bhookamp",
      "tremor",
      "shake",
    ],

    response:
      "Earthquake Safety (Offline):\n1. Drop, Cover & Hold On!\n2. Heavy furniture ke neeche chhupen.\n3. Lift ka use na karein, seedhiyo se bahar niklein.",
  },

  {
    keywords: [
      "helpline",
      "number",
      "emergency",
      "call",
      "sdma",
    ],

    response:
      "Bihar Emergency Contacts:\n• State Control Room: 1070 / 0612-2217357\n• National Emergency: 112\n• Ambulance: 102 / 108\n• Fire Brigade: 101",
  },

  {
    keywords: [
      "first aid",
      "chot",
      "bleeding",
      "injury",
    ],

    response:
      "First Aid Tips (Offline):\n1. Ghaw ko saaf kapde ya paani se dhoyein.\n2. Bleeding rokne ke liye ghaaw par dabaav banayein.\n3. Ambulance (102/108) ko call karein.",
  },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

const DisasterAlert = () => {
  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [menuOpen, setMenuOpen] = useState(false);

  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [severityFilter, setSeverityFilter] =
    useState("all");

  const [selectedDistrict, setSelectedDistrict] =
    useState("All Bihar");

  // =====================================================
  // BOT STATES
  // =====================================================

  const [isBotOpen, setIsBotOpen] = useState(false);

  const [isOnline, setIsOnline] =
    useState(navigator.onLine);

  const [inputMessage, setInputMessage] =
    useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "Namaste! Main aapka Bihar Safety Assistant hu. Offline ya Online dono mode me madad ke liye taiyar hu!",
    },
  ]);

  const chatBottomRef = useRef(null);

  // =====================================================
  // NETWORK DETECTOR
  // =====================================================

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );
    };
  }, []);

  // =====================================================
  // AUTO SCROLL CHAT
  // =====================================================

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isBotOpen]);

  // =====================================================
  // FETCH LIVE ALERTS
  // =====================================================

  const fetchAlerts = useCallback(async () => {
    setLoading(true);

    try {
      // =================================================
      // LIVE USGS EARTHQUAKE API
      // =================================================

      const response = await fetch(
        "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=3.5&limit=20" 
      ); 
 
      if (!response.ok) { 
        throw new Error( 
          "Earthquake API failed" 
        ); 
      } 
 
      const data = await response.json(); 
 
      const liveApiData = 
        data.features.map((item) => { 
          const mag = 
            item.properties.mag; 
 
          let severityLevel = "low"; 
 
          if (mag >= 6.0) { 
            severityLevel = "critical"; 
          } else if (mag >= 5.0) { 
            severityLevel = "high"; 
          } else if (mag >= 4.0) { 
            severityLevel = "medium"; 
          } 
 
          return { 
            id: item.id, 
 
            type: "earthquake", 
 
            title: 
              `Magnitude ${mag} Earthquake`, 
 
            location: 
              item.properties.place || 
              "Northern India Border", 
 
            time: new Date( 
              item.properties.time 
            ).toLocaleTimeString([], { 
              hour: "2-digit", 
              minute: "2-digit", 
            }), 
 
            severity: severityLevel, 
 
            status: 
              item.properties.status === 
              "reviewed" 
                ? "Active" 
                : "Monitoring", 
          }; 
        }); 
 
      // ================================================= 
      // BIHAR EMERGENCY FEED 
      // ================================================= 
 
      const biharAlertsFeed = [ 
        { 
          id: "bh-1", 
          type: "flood", 
          title: 
            "Ganga River Level Alert", 
          location: "Patna", 
          time: "10 mins ago", 
          severity: "high", 
          status: "Active", 
        }, 
 
        { 
          id: "bh-2", 
          type: "flood", 
          title: 
            "Kosi Water Discharge Watch", 
          location: "Supaul", 
          time: "25 mins ago", 
          severity: "critical", 
          status: "Active", 
        }, 
 
        { 
          id: "bh-3", 
          type: "heavy_rain", 
          title: 
            "Heavy Rainfall & Thunderstorm Warning", 
          location: "Darbhanga", 
          time: "40 mins ago", 
          severity: "high", 
          status: "Active", 
        }, 
 
        { 
          id: "bh-4", 
          type: "flood", 
          title: 
            "Gandak Embankment Advisory", 
          location: "Gopalganj", 
          time: "1 hour ago", 
          severity: "medium", 
          status: "Monitoring", 
        }, 
 
        { 
          id: "bh-5", 
          type: "heavy_rain", 
          title: 
            "Lightning Hazard Warning", 
          location: "Muzaffarpur", 
          time: "2 hours ago", 
          severity: "critical", 
          status: "Active", 
        }, 
 
        { 
          id: "bh-6", 
          type: "flood", 
          title: 
            "Bagmati Flood Water Surge", 
          location: "Sitamarhi", 
          time: "3 hours ago", 
          severity: "high", 
          status: "Active", 
        }, 
 
        { 
          id: "bh-7", 
          type: "earthquake", 
          title: 
            "Mild Tremors Felt", 
          location: "Kishanganj", 
          time: "4 hours ago", 
          severity: "low", 
          status: "Resolved", 
        }, 
      ]; 
 
      // ================================================= 
      // COMBINE DATA 
      // ================================================= 
 
      setAlerts([ 
        ...biharAlertsFeed, 
        ...liveApiData, 
      ]); 
    } catch (error) { 
      console.error( 
        "API Fetch Error:", 
        error 
      ); 
 
      // Even if API fails, show Bihar alerts 
      setAlerts([ 
        { 
          id: "bh-1", 
          type: "flood", 
          title: 
            "Ganga River Level Alert", 
          location: "Patna", 
          time: "10 mins ago", 
          severity: "high", 
          status: "Active", 
        }, 
 
        { 
          id: "bh-2", 
          type: "flood", 
          title: 
            "Kosi Water Discharge Watch", 
          location: "Supaul", 
          time: "25 mins ago", 
          severity: "critical", 
          status: "Active", 
        }, 
 
        { 
          id: "bh-3", 
          type: "heavy_rain", 
          title: 
            "Heavy Rainfall Warning", 
          location: "Darbhanga", 
          time: "40 mins ago", 
          severity: "high", 
          status: "Active", 
        }, 
      ]); 
    } finally { 
      setLoading(false); 
    } 
  }, []); 
 
  // ===================================================== 
  // INITIAL FETCH 
  // ===================================================== 
 
  useEffect(() => { 
    fetchAlerts(); 
  }, [fetchAlerts]); 
 
  // ===================================================== 
  // CHATBOT 
  // ===================================================== 
 
  const handleSendMessage = (e) => { 
    e.preventDefault(); 
 
    if (!inputMessage.trim()) { 
      return; 
    } 
 
    const userText = 
      inputMessage.toLowerCase(); 
 
    setMessages((prev) => [ 
      ...prev, 
 
      { 
        sender: "user", 
        text: inputMessage, 
      }, 
    ]); 
 
    setInputMessage(""); 
 
    setTimeout(() => { 
      let botResponse = ""; 
 
      const matched = 
        offlineKnowledgeBase.find( 
          (kb) => 
            kb.keywords.some((kw) => 
              userText.includes(kw) 
            ) 
        ); 
 
      // ================================================= 
      // OFFLINE 
      // ================================================= 
 
      if (!isOnline) { 
        botResponse = matched 
          ? `[Offline Engine]\n${matched.response}` 
          : "[Offline Engine] Network disconnect hai. Earthquake, Flood, First Aid ya Helpline ke bare me puchen."; 
      } 
 
      // ================================================= 
      // ONLINE 
      // ================================================= 
 
      else { 
        botResponse = matched 
          ? matched.response 
          : `Main live hu! ${selectedDistrict} me live disaster telemetry monitor ho rahi hai. Flood, Earthquake, First Aid ya Emergency guidelines ke bare me puchen.`; 
      } 
 
      setMessages((prev) => [ 
        ...prev, 
 
        { 
          sender: "bot", 
          text: botResponse, 
        }, 
      ]); 
    }, 300); 
  }; 
 
  // ===================================================== 
  // FILTER ALERTS 
  // ===================================================== 
 
  const filteredAlerts = useMemo(() => { 
    return alerts.filter((item) => { 
      const matchesSeverity = 
        severityFilter === "all" || 
        item.severity === 
          severityFilter; 
 
      const matchesDistrict = 
        selectedDistrict === "All Bihar" || 
        item.location 
          .toLowerCase() 
          .includes( 
            selectedDistrict.toLowerCase() 
          ); 
 
      return ( 
        matchesSeverity && 
        matchesDistrict 
      ); 
    }); 
  }, [ 
    alerts, 
    severityFilter, 
    selectedDistrict, 
  ]); 
 
  // ===================================================== 
  // RETURN 
  // ===================================================== 
 
  return ( 
    <div className="dashboard-layout-row"> 
 
      {/* ================================================= 
          SIDEBAR 
      ================================================= */} 
 
      <Sidebar 
        isOpen={menuOpen} 
      /> 
 
      {/* ================================================= 
          MAIN DISASTER CONTAINER 
      ================================================= */} 
 
      <div className="disaster-container"> 
 
        {/* ================================================= 
            TOP NAVIGATION 
        ================================================= */} 
 
        <div className="disaster-top-nav"> 
 
          {/* MENU BUTTON */} 
          <button 
            className="menu-btn" 
            onClick={() => 
              setMenuOpen(!menuOpen) 
            } 
            aria-label="Open menu" 
          > 
            <Menu size={26} /> 
          </button> 
 
          {/* BACK BUTTON */} 
          <button 
            className="back-btn" 
            onClick={() => 
              navigate(-1) 
            } 
          > 
            <ArrowLeft size={17} /> 
 
            <span> 
              Back 
            </span> 
          </button> 
 
        </div> 
 
        {/* ================================================= 
            HEADER 
        ================================================= */} 
 
        <div className="disaster-header"> 
 
          <div className="header-left"> 
 
            <div className="icon-badge-pulse"> 
              <ShieldAlert size={28} /> 
            </div> 
 
            <div> 
 
              <div className="header-tag"> 
 
                <span className="live-dot"></span> 
 
                Bihar Emergency Portal 
 
              </div> 
 
              <h2 className="header-title"> 
                Live Disaster & Flood Monitor 
              </h2> 
 
              <p className="header-subtitle"> 
                Real-time alert telemetry for 
                Bihar & Northern India 
              </p> 
 
            </div> 
 
          </div> 
 
          {/* ================================================= 
              RIGHT ACTIONS 
          ================================================= */} 
 
          <div className="header-right-actions"> 
 
            {/* AI BOT BUTTON */} 
 
            <button 
              className={`top-bot-btn ${ 
                isBotOpen 
                  ? "active" 
                  : "" 
              }`} 
              onClick={() => 
                setIsBotOpen( 
                  !isBotOpen 
                ) 
              } 
            > 
 
              <div className="bot-icon-glow"> 
 
                <Bot size={20} /> 
 
                <span 
                  className={`bot-status-ring ${ 
                    isOnline 
                      ? "online" 
                      : "offline" 
                  }`} 
                ></span> 
 
              </div> 
 
              <span className="bot-btn-label"> 
                AI Bot 
              </span> 
 
              <Sparkles 
                size={14} 
                className="sparkle-icon" 
              /> 
 
            </button> 
 
            {/* NETWORK STATUS */} 
 
            <div 
              className={`network-pill ${ 
                isOnline 
                  ? "online" 
                  : "offline" 
              }`} 
            > 
 
              {isOnline ? ( 
                <Wifi size={13} /> 
              ) : ( 
                <WifiOff size={13} /> 
              )} 
 
              <span> 
                {isOnline 
                  ? "Live" 
                  : "Offline"} 
              </span> 
 
            </div> 
 
            {/* REFRESH */} 
 
            <button 
              onClick={fetchAlerts} 
              className="refresh-btn" 
              disabled={loading} 
            > 
 
              <RefreshCw 
                size={14} 
                className={ 
                  loading 
                    ? "spin-animation" 
                    : "" 
                } 
              /> 
 
              Refresh 
 
            </button> 
 
          </div> 
 
        </div> 
 
        {/* ================================================= 
            BOT DROPDOWN 
        ================================================= */} 
 
        {isBotOpen && ( 
          <div className="header-bot-dropdown"> 
 
            <div className="bot-dropdown-header"> 
 
              <div className="bot-profile"> 
 
                <div className="bot-avatar"> 
                  <Bot size={18} /> 
                </div> 
 
                <div> 
 
                  <h4 className="bot-name"> 
                    Bihar Safety Bot 
                  </h4> 
 
                  <p className="bot-mode-text"> 
                    {isOnline 
                      ? "Online Intelligence" 
                      : "Offline Engine Active"} 
                  </p> 
 
                </div> 
 
              </div> 
 
              <button 
                className="bot-close-icon" 
                onClick={() => 
                  setIsBotOpen(false) 
                } 
              > 
                <X size={16} /> 
              </button> 
 
            </div> 
 
            {/* CHAT */} 
 
            <div className="bot-dropdown-chat"> 
 
              {messages.map( 
                (msg, idx) => ( 
                  <div 
                    key={idx} 
                    className={`bot-msg-bubble ${ 
                      msg.sender 
                    }`} 
                  > 
                    {msg.text} 
                  </div> 
                ) 
              )} 
 
              <div 
                ref={chatBottomRef} 
              /> 
 
            </div> 
 
            {/* INPUT */} 
 
            <form 
              onSubmit={ 
                handleSendMessage 
              } 
              className="bot-dropdown-input" 
            > 
 
              <input 
                type="text" 
                placeholder={ 
                  isOnline 
                    ? "Ask Safety Bot..." 
                    : "Ask offline bot (Flood, Helpline)..." 
                } 
                value={ 
                  inputMessage 
                } 
                onChange={(e) => 
                  setInputMessage( 
                    e.target.value 
                  ) 
                } 
              /> 
 
              <button type="submit"> 
                <Send size={14} /> 
              </button> 
 
            </form> 
 
          </div> 
        )} 
 
        {/* ================================================= 
            EMERGENCY HELPLINE 
        ================================================= */} 
 
        <div className="emergency-banner"> 
 
          <div className="banner-info"> 
 
            <PhoneCall 
              size={18} 
              className="banner-icon" 
            /> 
 
            <span> 
 
              <strong> 
                Bihar State Emergency Helpline: 
              </strong> 
 
              {" "}1070 | 0612-2217357 
              {" "}(SDMA Control Room) 
 
            </span> 
 
          </div> 
 
        </div> 
 
        {/* ================================================= 
            CONTROLS 
        ================================================= */} 
 
        <div className="controls-bar"> 
 
          {/* SEVERITY FILTER */} 
 
          <div className="filter-tabs"> 
 
            {[ 
              "all", 
              "critical", 
              "high", 
              "medium", 
              "low", 
            ].map((level) => ( 
 
              <button 
                key={level} 
                onClick={() => 
                  setSeverityFilter( 
                    level 
                  ) 
                } 
                className={`filter-btn ${ 
                  severityFilter === 
                  level 
                    ? "active" 
                    : "" 
                }`} 
              > 
 
                {level} 
 
              </button> 
 
            ))} 
 
          </div> 
 
          {/* DISTRICT */} 
 
          <div className="location-select-wrapper"> 
 
            <MapPin 
              size={16} 
              className="location-icon" 
            /> 
 
            <select 
              value={ 
                selectedDistrict 
              } 
              onChange={(e) => 
                setSelectedDistrict( 
                  e.target.value 
                ) 
              } 
              className="location-dropdown" 
            > 
 
              {biharDistricts.map( 
                (dist, idx) => ( 
 
                  <option 
                    key={idx} 
                    value={dist} 
                  > 
                    {dist} 
                  </option> 
 
                ) 
              )} 
 
            </select> 
 
          </div> 
 
        </div> 
 
        {/* ================================================= 
            ALERT LIST 
        ================================================= */} 
 
        <div className="alert-list"> 
 
          {loading ? ( 
 
            <div className="loading-state"> 
              Fetching disaster telemetry 
              for Bihar... 
            </div> 
 
          ) : filteredAlerts.length === 0 ? ( 
 
            <div className="empty-state"> 
 
              No active alerts found for 
              district: 
 
              {" "} 
 
              <strong> 
                {selectedDistrict} 
              </strong> 
 
            </div> 
 
          ) : ( 
 
            filteredAlerts.map( 
              (alert) => { 
 
                const config = 
                  disasterConfig[ 
                    alert.type 
                  ] || 
                  disasterConfig.default; 
 
                const IconComponent = 
                  config.icon; 
 
                return ( 
 
                  <div 
                    key={alert.id} 
                    className="alert-card" 
                  > 
 
                    <div className="alert-content"> 
 
                      <div 
                        className={`disaster-icon ${config.classKey}`} 
                      > 
 
                        <IconComponent 
                          size={22} 
                        /> 
 
                      </div> 
 
                      <div className="alert-details"> 
 
                        <div className="alert-title-row"> 
 
                          <h3 className="alert-title"> 
                            {alert.title} 
                          </h3> 
 
                          <span 
                            className={`severity-badge badge-${alert.severity}`} 
                          > 
                            {alert.severity} 
                          </span> 
 
                        </div> 
 
                        <div className="alert-meta"> 
 
                          <span className="meta-item"> 
 
                            <MapPin size={12} /> 
 
                            {" "} 
 
                            {alert.location}, 
                            Bihar 
 
                          </span> 
 
                          <span className="meta-item"> 
 
                            <Clock size={12} /> 
 
                            {" "} 
 
                            {alert.time} 
 
                          </span> 
 
                        </div> 
 
                      </div> 
 
                    </div> 
 
                    <div className="alert-action"> 
 
                      <span 
                        className={`status-badge status-${alert.status.toLowerCase()}`} 
                      > 
                        {alert.status} 
                      </span> 
 
                      <ChevronRight 
                        size={18} 
                        style={{ 
                          color: 
                            "#64748b", 
                        }} 
                      /> 
 
                    </div> 
 
                  </div> 
 
                ); 
              } 
            ) 
 
          )} 
 
        </div> 
 
      </div> 
    </div> 
  ); 
}; 
 
export default DisasterAlert; 