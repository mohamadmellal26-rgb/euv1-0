import './TemplatesSection.css';

export default function TemplatesSection() {
  return (
    <div className="ts-container">
      <div className="ts-wrapper">
        
        {/* قسم Start with a template */}
        <div className="ts-templates-header-section">
          <div className="ts-header-flex">
            <h2 className="ts-main-title">Start with a template</h2>
            
            {/* التبويبات العلوية */}
            <div className="ts-tabs-list">
              <button className="ts-tab-btn active">Apps and Games</button>
              <button className="ts-tab-btn">Landing Pages</button>
              <button className="ts-tab-btn">Components</button>
              <button className="ts-tab-btn">Dashboards</button>
              <button className="ts-tab-btn browse-all">Browse all →</button>
            </div>
          </div>

          {/* شبكة القوالب الثلاثة */}
          <div className="ts-cards-grid-3">
            
            {/* قالب 1 */}
            <div className="ts-template-card">
              <div className="ts-card-img-box bg-gradient-1"></div>
              <div className="ts-card-footer">
                <div className="ts-author-info">
                  <div className="ts-avatar bg-avatar-1">👩‍🦰</div>
                  <span className="ts-card-title">Image Generation Playground</span>
                </div>
                <div className="ts-card-stats">
                  <span>👁 6.1K</span>
                  <span>❤️ 682</span>
                </div>
              </div>
            </div>

            {/* قالب 2 */}
            <div className="ts-template-card group">
              <div className="ts-card-img-box bg-gradient-2 relative">
                <div className="ts-view-details-overlay">
                  <button className="ts-view-details-btn">View Details</button>
                </div>
              </div>
              <div className="ts-card-footer">
                <div className="ts-author-info">
                  <div className="ts-avatar bg-avatar-2">🧑‍💻</div>
                  <span className="ts-card-title">Brilliance SaaS Landing Page</span>
                </div>
                <div className="ts-card-stats">
                  <span>👁 13.6K</span>
                  <span>❤️ 2K</span>
                </div>
              </div>
            </div>

            {/* قالب 3 */}
            <div className="ts-template-card">
              <div className="ts-card-img-box bg-gradient-3"></div>
              <div className="ts-card-footer">
                <div className="ts-author-info">
                  <div className="ts-avatar bg-avatar-3">HS</div>
                  <span className="ts-card-title">3D Gallery Photography Template</span>
                </div>
                <div className="ts-card-stats">
                  <span>👁 3.2K</span>
                  <span>❤️ 815</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* الشبكة السفلية للبطاقات */}
        <div className="ts-bottom-grid">
          
          {/* البطاقة 1 */}
          <div className="ts-feature-card">
            <div className="ts-feature-content">
              <h3>Prompt. Build. Publish.</h3>
              <p>Generate working applications in minutes with AI. Publish as live websites in seconds.</p>
            </div>
          </div>

          {/* البطاقة 2 */}
          <div className="ts-feature-card">
            <div className="ts-feature-content">
              <h3>Sync with a repo</h3>
              <p>Connect to GitHub and push code directly to your repository.</p>
            </div>
            <div className="ts-repo-icons">
              <div className="ts-black-circle"></div>
              <div className="ts-github-circle">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </div>
            </div>
          </div>

          {/* البطاقة 3 */}
          <div className="ts-feature-card">
            <div className="ts-feature-content">
              <h3>Integrate with apps</h3>
              <p>Build with your favorite tools and APIs. Automatic integration, no accounts required.</p>
            </div>
            <div className="ts-color-boxes-grid">
              <div className="ts-c-box pink"></div>
              <div className="ts-c-box purple"></div>
              <div className="ts-c-box green"></div>
              <div className="ts-c-box yellow"></div>
              <div className="ts-c-box blue"></div>
              <div className="ts-c-box cyan"></div>
            </div>
          </div>

          {/* البطاقة 4 */}
          <div className="ts-feature-card">
            <div className="ts-feature-content">
              <h3>Deploy to Vercel</h3>
              <p>Go live instantly with one-click deployment to production in seconds.</p>
            </div>
            <div className="ts-vercel-triangle-wrapper">
              <div className="ts-vercel-triangle"></div>
            </div>
          </div>

          {/* البطاقة 5 */}
          <div className="ts-feature-card">
            <div className="ts-feature-content">
              <h3>Edit with design mode</h3>
              <p>Fine-tune every detail with visual controls and live preview.</p>
            </div>
            <div className="ts-design-mode-preview">
              <span className="ts-badge-pill">♦ button ▾</span>
              <div className="ts-rsvp-box">RSVP Here</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}