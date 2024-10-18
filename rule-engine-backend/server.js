const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());

// In-memory storage for rules (use a database for production)
let rules = [];

// API Endpoints

// Create a new rule
app.post('/create_rule', (req, res) => {
  const { ruleString } = req.body;
  if (!ruleString) {
    return res.status(400).json({ error: 'Rule string is required' });
  }

  const newRule = {
    id: rules.length + 1,
    name: ruleString,
    createdDate: new Date().toISOString().split('T')[0]
  };
  rules.push(newRule);
  res.json(newRule);
});

// Get all rules
app.get('/rules', (req, res) => {
  res.json(rules);
});

// Combine selected rules
app.post('/combine_rules', (req, res) => {
  const { ruleIds } = req.body;
  const selectedRules = rules.filter(rule => ruleIds.includes(rule.id));
  if (selectedRules.length === 0) {
    return res.status(400).json({ error: 'No valid rules selected' });
  }

  // Combine rules (simplified)
  const combinedRuleString = selectedRules.map(rule => `(${rule.name})`).join(' AND ');
  const combinedRule = {
    id: rules.length + 1,
    name: combinedRuleString,
    createdDate: new Date().toISOString().split('T')[0]
  };
  rules.push(combinedRule);
  res.json(combinedRule);
});

// Evaluate rule (mock evaluation)
app.post('/evaluate_rule', (req, res) => {
  const { ruleId, attributes } = req.body;
  const rule = rules.find(r => r.id === ruleId);

  if (!rule) {
    return res.status(400).json({ error: 'Rule not found' });
  }

  // For demonstration, we'll mock the evaluation (you can extend this)
  const isEligible = attributes.age > 30 && attributes.department === 'Sales';
  res.json({ result: isEligible });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
