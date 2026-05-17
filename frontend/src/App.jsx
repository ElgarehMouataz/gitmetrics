import { useState } from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [username, setUsername] = useState('')
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const fetchdata = async (e) => {
    e.preventDefault()
    const inputUsername = e.target[0].value.trim()
    if (!inputUsername) {
      setError('Please enter a GitHub username')
      return
    }
    setLoading(true)
    setError('')
    setCurrentPage(1)
    try {
      const response = await fetch(`http://localhost:8000/api/analyze/${inputUsername}`)
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
    <>
      <h1>Gitmetrics</h1>
      <form onSubmit={fetchdata}>
        <input type="text" placeholder="Enter GitHub username" />
        <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Get Metrics'}</button>
      </form>
      {error && <p style={{ color: '#ff6b6b', marginTop: '10px' }}>{error}</p>}
      <div>
        {profileData && (
          <div style={{ marginBottom: '20px', padding: '30px', background: '#1e1e1e', color: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <div style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '25px' }}>
              <h2 style={{ margin: 0, fontSize: '28px' }}>User: {profileData.username}</h2>
              <div style={{ display: 'flex', gap: '30px', marginTop: '10px', fontSize: '18px', color: '#bbb' }}>
                <div>Total Repositories: <strong style={{ color: '#fff' }}>{profileData.total_repos}</strong></div>
                <div>Total Stars: <strong style={{ color: '#fff' }}>{profileData.total_stars}</strong></div>
              </div>
            </div>
            
            <h3 style={{ marginTop: 0, marginBottom: '25px', fontSize: '22px', textAlign: 'center' }}>Account Overview</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start', justifyContent: 'center' }}>
              
              {/* Left: Paginated Repositories */}
              <div style={{ flexGrow: 1, minWidth: '280px', maxWidth: '350px', background: '#252525', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '18px', borderBottom: '1px solid #444', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Repositories</span>
                  <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal' }}>Page {currentPage} of {totalPages}</span>
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '320px' }}>
                  {currentRepos.map((repo, idx) => {
                    const fallbackColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
                    const color = githubLanguageColors[repo.language] || fallbackColors[idx % fallbackColors.length];
                    return (
                      <div key={idx} style={{ background: '#1f1f1f', padding: '12px', borderRadius: '6px', borderLeft: `4px solid ${repo.language !== 'None' ? color : '#555'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <a href={repo.url} target="_blank" rel="noopener noreferrer" style={{ color: '#58a6ff', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', wordBreak: 'break-word' }}>
                            {repo.name}
                          </a>
                          <span style={{ fontSize: '12px', color: '#aaa', background: '#333', padding: '2px 6px', borderRadius: '10px' }}>Stars: {repo.stars}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#ccc' }}>
                          {repo.language !== 'None' && <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color, display: 'inline-block' }}></span>}
                          <span>{repo.language !== 'None' ? repo.language : 'No Language'}</span>
                        </div>
                      </div>
                    );
                  })}
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
              <div style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                <Doughnut data={getChartData()} options={{ plugins: { legend: { display: false } } }} />
              </div>
              
              {/* Right: Language Statistics Legend */}
              <div style={{ flexGrow: 1, minWidth: '280px', maxWidth: '350px', background: '#252525', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
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
        )}
      </div>
    </>
  )
}

export default App
