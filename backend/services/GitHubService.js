const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const JobMatch = require('../models/JobMatch');
const AIService = require('./AIService');

/**
 * Extracts the GitHub username from a URL or raw string.
 */
const extractUsername = (urlOrUsername) => {
  if (!urlOrUsername) return '';
  let cleaned = urlOrUsername.trim().replace(/\/$/, '');
  if (cleaned.includes('github.com')) {
    const parts = cleaned.split('/');
    return parts[parts.length - 1];
  }
  return cleaned;
};

/**
 * Fetches GitHub profile and repositories for a username, calculates statistics,
 * retrieves related resume/analysis context, and calls AIService to perform comparison.
 */
const analyzeGitHub = async (userId, resumeId, githubUrl) => {
  const username = extractUsername(githubUrl);
  if (!username) {
    throw new Error('Invalid GitHub URL or username provided');
  }

  // 1. Fetch GitHub Profile
  const profileRes = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      'User-Agent': 'ResumeIQ-AI-Portfolio-Analyzer'
    }
  });

  if (profileRes.status === 403 || profileRes.status === 429) {
    throw new Error('GitHub API rate limit has been reached. Please try again later.');
  }
  if (profileRes.status === 404) {
    throw new Error(`GitHub user "${username}" not found.`);
  }
  if (!profileRes.ok) {
    throw new Error('Failed to fetch GitHub profile information.');
  }

  const profileData = await profileRes.json();

  // 2. Fetch Repositories
  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    headers: {
      'User-Agent': 'ResumeIQ-AI-Portfolio-Analyzer'
    }
  });

  if (reposRes.status === 403 || reposRes.status === 429) {
    throw new Error('GitHub API rate limit has been reached. Please try again later.');
  }
  if (!reposRes.ok) {
    throw new Error('Failed to fetch GitHub repositories.');
  }

  const reposData = await reposRes.json();

  // 3. Process statistics and languages
  let totalStars = 0;
  let totalForks = 0;
  const languagesMap = {};

  reposData.forEach(repo => {
    totalStars += repo.stargazers_count || 0;
    totalForks += repo.forks_count || 0;
    if (repo.language) {
      languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
    }
  });

  // Check README availability for top 5 repos to avoid rate limit issues on individual file fetches
  const topRepos = [...reposData]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 5);

  const topReposWithReadme = await Promise.all(
    topRepos.map(async (repo) => {
      try {
        const readmeRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, {
          method: 'GET',
          headers: {
            'User-Agent': 'ResumeIQ-AI-Portfolio-Analyzer'
          }
        });
        if (readmeRes.status === 403 || readmeRes.status === 429) {
          throw new Error('GitHub API rate limit has been reached. Please try again later.');
        }
        return {
          name: repo.name,
          description: repo.description || '',
          html_url: repo.html_url,
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          language: repo.language || 'Unknown',
          hasReadme: readmeRes.ok,
          updatedAt: repo.updated_at
        };
      } catch (err) {
        if (err.message.includes('rate limit')) throw err;
        return {
          name: repo.name,
          description: repo.description || '',
          html_url: repo.html_url,
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          language: repo.language || 'Unknown',
          hasReadme: false,
          updatedAt: repo.updated_at
        };
      }
    })
  );

  const repositories = reposData.map(repo => {
    const isTop = topRepos.find(r => r.name === repo.name);
    return {
      name: repo.name,
      description: repo.description || '',
      html_url: repo.html_url,
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      language: repo.language || 'Unknown',
      hasReadme: isTop ? topReposWithReadme.find(r => r.name === repo.name).hasReadme : false,
      updatedAt: repo.updated_at
    };
  });

  const statistics = {
    totalRepos: profileData.public_repos,
    totalStars,
    totalForks,
    followers: profileData.followers,
    following: profileData.following,
    accountAgeMonths: Math.round((new Date() - new Date(profileData.created_at)) / (1000 * 60 * 60 * 24 * 30.4)),
    lastActivityDays: Math.round((new Date() - new Date(profileData.updated_at)) / (1000 * 60 * 60 * 24))
  };

  // 4. Fetch Resume data
  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) {
    throw new Error('Associated Resume not found');
  }

  const parsedResume = resume.parsedData || {};

  // Fetch optional ATS & Job Match analyses
  const atsAnalysis = await ResumeAnalysis.findOne({ resumeId, userId });
  const jobMatch = await JobMatch.findOne({ resumeId, userId }).sort({ createdAt: -1 });

  // 5. Call AI Service to compare resume and GitHub portfolio
  const aiResult = await AIService.analyzeGitHubPortfolio({
    parsedResume,
    atsAnalysis,
    jobMatch,
    profile: {
      username: profileData.login,
      bio: profileData.bio || '',
      followers: profileData.followers,
      following: profileData.following,
      publicRepos: profileData.public_repos,
    },
    statistics
  });

  return {
    profile: {
      username: profileData.login,
      avatarUrl: profileData.avatar_url,
      bio: profileData.bio || '',
      followers: profileData.followers,
      following: profileData.following,
      publicRepos: profileData.public_repos,
      stars: totalStars,
      forks: totalForks,
      createdAt: profileData.created_at,
      updatedAt: profileData.updated_at,
    },
    repositories,
    languages: languagesMap,
    statistics,
    analysis: aiResult,
    overallScore: aiResult.overallScore,
    strengths: aiResult.strengths,
    weaknesses: aiResult.weaknesses,
    recommendations: aiResult.recommendations
  };
};

module.exports = {
  extractUsername,
  analyzeGitHub
};
