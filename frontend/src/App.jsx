import React, { useState } from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [username, setUsername] = useState('')
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const fetchMetricsForUser = async (targetUsername) => {
    setLoading(true)
    setError('')
    setCurrentPage(1)
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${baseURL}/api/analyze/${targetUsername}`)
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'User not found');
      }
      const data = await response.json()
      setProfileData(data)
    } catch (error) {
      setError(error.message || 'Error fetching profile data')
      setProfileData(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchdata = async (e) => {
    e.preventDefault()
    const inputUsername = e.target[0].value.trim()
    if (!inputUsername) {
      setError('Please enter a GitHub username')
      return
    }
    await fetchMetricsForUser(inputUsername)
  }

  const githubLanguageColors = {
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    'C++': '#f34b7d',
    'C#': '#178600',
    Java: '#b07219',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Vue: '#41b883',
    Shell: '#89e051',
    C: '#555555',
    Jupyter: '#DA5B0B',
    Elixir: '#6e4a7e',
    Haskell: '#5e5086',
    Lua: '#000080',
    Perl: '#0298c3',
    R: '#198ce7',
    Scala: '#dc322f',
    Dockerfile: '#384d54',
  };

  const getChartData = () => {
    if (!profileData || !profileData.languages) return null;
    const labels = Object.keys(profileData.languages);
    const data = Object.values(profileData.languages);
    
    const fallbackColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    
    const backgroundColors = labels.map((lang, index) => {
      return githubLanguageColors[lang] || fallbackColors[index % fallbackColors.length];
    });

    return {
      labels: labels,
      datasets: [
        {
          label: 'Repositories',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: '#1e1e1e',
          borderWidth: 2,
        },
      ],
    };
  };

  const sortedRepos = profileData?.repos ? [...profileData.repos].sort((a, b) => {
    const aHasLang = a.language !== 'None';
    const bHasLang = b.language !== 'None';
    if (aHasLang && !bHasLang) return -1;
    if (!aHasLang && bHasLang) return 1;
    return b.stars - a.stars;
  }) : [];

  const reposPerPage = 5;
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = sortedRepos.slice(indexOfFirstRepo, indexOfLastRepo);
  const totalPages = sortedRepos.length ? Math.ceil(sortedRepos.length / reposPerPage) : 1;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <h1 style={{ fontSize: '46px', fontWeight: '800', margin: '0 0 10px 0', color: '#58a6ff', textShadow: '0 2px 10px rgba(88, 166, 255, 0.3)', lineHeight: '1.2', display: 'inline-block' }}>
          Gitmetrics
        </h1>
        <p style={{ color: '#8b949e', fontSize: '16px', margin: 0 }}>A lightweight GitHub profile analyzer and language distribution tracker</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
        <form onSubmit={fetchdata} style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '500px', background: '#161b22', padding: '8px', borderRadius: '8px', border: '1px solid #30363d', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <input 
            type="text" 
            placeholder="Enter GitHub username..." 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ flexGrow: 1, background: 'transparent', border: 'none', color: '#c9d1d9', padding: '10px 16px', fontSize: '16px', outline: 'none' }} 
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ background: loading ? '#21262d' : '#238636', color: '#fff', border: 'none', padding: '10px 24px', fontSize: '16px', fontWeight: '600', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          >
            {loading ? 'Analyzing...' : 'Get Metrics'}
          </button>
        </form>
      </div>

      {!loading && !profileData && (
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: '#8b949e', fontSize: '14px', marginBottom: '14px' }}>Try exploring popular sample profiles:</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'sobolevn', desc: 'Python Expert' },
              { label: 'torvalds', desc: 'Linux Creator' },
              { label: 'gaearon', desc: 'React Co-author' },
              { label: 'ElgarehMouataz', desc: 'Student Developer' }
            ].map((sample) => (
              <button
                key={sample.label}
                onClick={() => {
                  setUsername(sample.label);
                  fetchMetricsForUser(sample.label);
                }}
                style={{ background: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', transition: 'border-color 0.2s' }}
              >
                <strong style={{ color: '#58a6ff' }}>{sample.label}</strong> <span style={{ color: '#8b949e' }}>({sample.desc})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(255, 107, 107, 0.1)', border: '1px solid #ff6b6b', color: '#ff6b6b', padding: '12px 20px', borderRadius: '8px', maxWidth: '500px', margin: '0 auto 30px auto', textAlign: 'center', fontWeight: '500' }}>
          {error}
        </div>
      )}

      <div>
        {profileData && (
          <div style={{ marginBottom: '20px', padding: '30px', background: '#1e1e1e', color: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <div style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '28px' }}>User: {profileData.username}</h2>
              <div style={{ display: 'flex', gap: '30px', fontSize: '18px', color: '#bbb' }}>
                <div>Total Repositories: <strong style={{ color: '#fff' }}>{profileData.total_repos}</strong></div>
                <div>Total Stars: <strong style={{ color: '#fff' }}>{profileData.total_stars}</strong></div>
              </div>
            </div>

            {/* Dynamic Developer Persona Banner */}
            {(() => {
              const entries = Object.entries(profileData.languages);
              let topLang = 'None';
              if (entries.length > 0) {
                entries.sort((a, b) => b[1] - a[1]);
                topLang = entries[0][0];
              }
              const totalClassified = Object.values(profileData.languages).reduce((sum, val) => sum + val, 0);
              const topLangPercentage = totalClassified > 0 && topLang !== 'None' ? ((profileData.languages[topLang] / totalClassified) * 100).toFixed(1) : 0;

              return (
                <div style={{ background: '#252525', border: '1px solid #333', borderRadius: '8px', padding: '16px 20px', marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-around', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ color: '#8b949e', fontSize: '13px', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Primary Language Focus</span>
                    <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#58a6ff' }}>{topLang !== 'None' ? `${topLang} (${topLangPercentage}%)` : 'No classified languages'}</span>
                  </div>
                  <div style={{ borderLeft: '1px solid #333', paddingLeft: '20px', textAlign: 'center' }}>
                    <span style={{ color: '#8b949e', fontSize: '13px', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Community Impact</span>
                    <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#238636' }}>{profileData.total_stars} Stars across {profileData.total_repos} Repos</span>
                  </div>
                  <div style={{ borderLeft: '1px solid #333', paddingLeft: '20px', textAlign: 'center' }}>
                    <span style={{ color: '#8b949e', fontSize: '13px', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Language Breadth</span>
                    <span style={{ fontSize: '17px', fontWeight: 'bold', color: '#a371f7' }}>{entries.length} Languages tracked</span>
                  </div>
                </div>
              );
            })()}
            
            <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '22px', textAlign: 'center' }}>Account Overview</h3>
            
            <div className="hero-grid">
              
              {/* Left: Paginated Repositories */}
              <div style={{ background: '#252525', padding: '20px', borderRadius: '10px', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '18px', borderBottom: '1px solid #444', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Repositories</span>
                    <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal' }}>Page {currentPage} of {totalPages}</span>
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {currentRepos.map((repo, idx) => {
                      const fallbackColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
                      const color = githubLanguageColors[repo.language] || fallbackColors[idx % fallbackColors.length];
                      return (
                        <div key={idx} style={{ background: '#1f1f1f', padding: '14px', borderRadius: '6px', borderLeft: `4px solid ${repo.language !== 'None' ? color : '#555'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <a href={repo.url} target="_blank" rel="noopener noreferrer" style={{ color: '#58a6ff', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', wordBreak: 'break-word', display: 'inline-block', marginRight: '10px' }}>
                              {repo.name} <span style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'normal' }}>↗</span>
                            </a>
                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                              <span style={{ fontSize: '12px', color: '#c9d1d9', background: '#30363d', padding: '2px 6px', borderRadius: '10px', border: '1px solid #444' }}>Stars: {repo.stars}</span>
                              <span style={{ fontSize: '12px', color: '#c9d1d9', background: '#30363d', padding: '2px 6px', borderRadius: '10px', border: '1px solid #444' }}>Forks: {repo.forks}</span>
                              <span style={{ fontSize: '12px', color: '#c9d1d9', background: '#30363d', padding: '2px 6px', borderRadius: '10px', border: '1px solid #444' }}>Watchers: {repo.watchers}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#ccc' }}>
                            {repo.language !== 'None' && <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, display: 'inline-block' }}></span>}
                            <span>{repo.language !== 'None' ? repo.language : 'No Language'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #333' }}>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      disabled={currentPage === 1}
                      style={{ padding: '6px 14px', background: currentPage === 1 ? '#333' : '#30363d', color: currentPage === 1 ? '#666' : '#c9d1d9', border: '1px solid #444', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    >
                      Previous
                    </button>
                    <span style={{ fontSize: '14px', color: '#aaa' }}>{currentPage} / {totalPages}</span>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      disabled={currentPage === totalPages}
                      style={{ padding: '6px 14px', background: currentPage === totalPages ? '#333' : '#30363d', color: currentPage === totalPages ? '#666' : '#c9d1d9', border: '1px solid #444', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                      Next
                    </button>
                  </div>
                )}
               </div>

              {/* Middle: Doughnut Chart */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
                <div style={{ width: '100%', maxWidth: '280px' }}>
                  <Doughnut data={getChartData()} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: true }} />
                </div>
              </div>
              
              {/* Right: Language Statistics Legend */}
              <div style={{ background: '#252525', padding: '20px', borderRadius: '10px', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 15px 0', fontSize: '18px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>Language Statistics</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(() => {
                      const totalClassifiedRepos = Object.values(profileData.languages).reduce((sum, val) => sum + val, 0);
                      return Object.entries(profileData.languages).map(([lang, count], index) => {
                        const percentage = totalClassifiedRepos > 0 ? ((count / totalClassifiedRepos) * 100).toFixed(1) : 0;
                        const fallbackColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
                        const color = githubLanguageColors[lang] || fallbackColors[index % fallbackColors.length];
                        return (
                          <div key={lang} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: color, display: 'inline-block' }}></span>
                              <span style={{ fontWeight: '500' }}>{lang}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#ccc' }}>
                              <span><strong>{count}</strong> {count === 1 ? 'repo' : 'repos'}</span>
                              <span style={{ background: '#333', padding: '3px 8px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', color: '#fff', minWidth: '55px', textAlign: 'right' }}>{percentage}%</span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      <footer style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #30363d', textAlign: 'center', color: '#8b949e', fontSize: '14px' }}>
        <p style={{ marginBottom: '8px' }}>Gitmetrics Analytics Dashboard &bull; Built with Python, FastAPI, React, and Chart.js</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <a href="https://github.com/ElgarehMouataz/gitmetrics" target="_blank" rel="noopener noreferrer" style={{ color: '#58a6ff', textDecoration: 'none' }}>GitHub Repository</a>
          <span>&bull;</span>
          <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" style={{ color: '#58a6ff', textDecoration: 'none' }}>API Documentation (/docs)</a>
        </div>
      </footer>
    </div>
  )
}

export default App
