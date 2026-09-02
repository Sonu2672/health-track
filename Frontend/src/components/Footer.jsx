import React from 'react';
import '../css/Footer.css'; 

 function Footer() {

const nav = [
  { id: 1, name: "Home", url: "#home" },
  { id: 2, name: "Blogs", url: "#blogs" },
  { id: 3, name: "Categories", url: "#categories" },
  { id: 4, name: "About", url: "#about" },
  { id: 5, name: "Contact", url: "#contact" }
];

const categories = [
  { id: 1, name: "Technology", url: "#tech" },
  { id: 2, name: "React", url: "#react" },
  { id: 3, name: "Node.js", url: "#node" },
  { id: 4, name: "JavaScript", url: "#js" },
  { id: 5, name: "Database", url: "#db" }
];

const socials = [
  { id: 1, name: "Facebook", icon: "📘", url: "#fb" },
  { id: 2, name: "Twitter", icon: "🐦", url: "#tw" },
  { id: 3, name: "LinkedIn", icon: "💼", url: "#ln" },
  { id: 4, name: "GitHub", icon: "🐙", url: "#gh" }
];


  return (
 
    <footer className="main-footer">
      <div className="footer-container">
        
        {/* LEFT BLOCK: LOGO & ABOUT */}
        <div className="footer-brand-section">
          <div className="footer-logo-row">
            <div className="footer-logo-box">B</div>
            <span className="footer-logo-text">Blogify</span>
          </div>
          <p className="footer-brand-desc">
            A simple and powerful CMS built beautifully for creators and developers.
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} Blogify CMS. All rights reserved.
          </p>
        </div>

        {/* CENTER BLOCK: QUICK LINKS */}
        <div className="footer-links-grid">
          <div className="footer-links-col">
            <h4>Quick Links</h4>
            
            <ul>
              {nav.map((item,index)=>{
                return <li key={index}><a href={item.url}>{item.name}</a></li>
              })}
             
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Categories</h4>
            <ul>
              {categories.map((item,index)=>{
                return  <li key={index}><a href={item.url}>{item.name}</a></li>
              })}
  
            </ul>
          </div>
        </div>

        {/* RIGHT BLOCK: NEWSLETTER SUBSCRIBE */}
        <div className="footer-subscribe-section">
          <h4>Subscribe</h4>
          <p className="subscribe-text">Get the latest updates in your inbox.</p>
          <form className="footer-subscribe-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className="footer-input" />
            <button type="submit" className="footer-sub-btn">Subscribe</button>
          </form>
          
          {/* SOCIAL ICONS */}
          <div className="footer-socials">
            {socials.map((item)=>{
              return <a href={item.url}>{item.icon}</a>
            })}
          </div>
        </div>

      </div>
    </footer>
  );
}
export default Footer;