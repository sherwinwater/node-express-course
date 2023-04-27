// const express = require('express')
// const app = express()

// app.get
// app.post
// app.put
// app.delete
// app.all
// app.use
// app.listen

;('use strict')

/**
 * This is code from a codility challenge written in JS.
 * - Should store candidates in a POST endpoint (just in memory)
 * - Should get candidates in a GET endpoint, based on which has the most matching skills
 */

//  Types for reference:
// type Candidate = {
//   id: string, // UUID
//   name: string,
//   skills: string[],
// }
// type CandidateSkillCount = {
//   candidateId: Candidate["id"],
//   skillMatchCount: number,
// };

const express = require('express')
const app = express()
app.use(express.json())

// TODO: Build a repo for candidates
const availableCandidates = [
  { id: '1', name: 'John', skills: ['javascript', 'react', 'node'] },
  { id: '2', name: 'Jane', skills: ['javascript', 'angular', 'node'] }
]
// const availableCandidates = []

// TODO: Put in repo
function getCandidateById (candidates, id) {
  return candidates.find(candidate => candidate.id === id)
}

// TODO: Put in controller
function getSkillsFromRequest (req) {
  const { skills } = req.query
  if (!skills) throw new Error('No skills were provided')
  return skills.split(',')
}

// TODO: Put in candidate skills feature
function getCountOfMatchedSkills (candidate, skills) {
  return candidate.skills.filter(skill => skills.includes(skill)).length
}

// TODO: Put in candidate skills feature
function getCandidatesWithSkillCount (skills) {
  return availableCandidates.map(candidate => {
    return {
      candidateId: candidate.id,
      skillMatchCount: getCountOfMatchedSkills(candidate, skills)
    }
  })
}

// TODO: Put in candidate skills feature
function sortBySkillCount (candidateSkills) {
  return candidateSkills.sort((a, b) => {
    if (a.skillMatchCount > b.skillMatchCount) {
      return -1
    } else if (a.skillMatchCount < b.skillMatchCount) {
      return 1
    } else {
      return 0
    }
  })
}

// TODO: Put in candidate skills feature
function filterBySkillCount (candidateSkills) {
  return candidateSkills.filter(candidate => candidate.skillMatchCount > 0)
}

// ENDPOINTS

// TODO: Make a controller instead of writing logic in the route
app.post('/candidates', (req, res) => {
  if (!req.body || !req.body.skills) {
    return res.status(400).send()
  }
  availableCandidates.push(req.body)
  return res.status(201).send()
})

// TODO: Make a controller instead of writing logic in the route
app.get('/candidates/search', (req, res) => {
  console.log('first', 'candidates')
  //   res.status(200).send('search Page')

  try {
    if (availableCandidates.length === 0) {
      return res.status(404).send()
    }

    // TODO: Pipe for readability
    const matchedCandidates = filterBySkillCount(
      sortBySkillCount(getCandidatesWithSkillCount(getSkillsFromRequest(req)))
    )

    if (matchedCandidates.length === 0) {
      return res.status(404).send()
    }

    const matchedCandidate = getCandidateById(
      availableCandidates,
      matchedCandidates[0].candidateId
    )

    return res.status(200).json(matchedCandidate)
  } catch (e) {
    return res.status(400).json({ message: e.message }).send()
  }
})

app.get('/', (req, res) => {
  console.log('user hit the resource')
  res.status(200).send('Home Page')
})

app.get('/about', (req, res) => {
  res.status(200).send('About Page')
})

// app.all('*', (req, res) => {
//   res.status(404).send('<h1>resource not found</h1>')
// })

app.listen(5000, () => {
  console.log('server is listening on port 5000...')
})

// app.listen(process.env.HTTP_PORT || 5000)

// /candidates/search?skills=javascript,react,redux
