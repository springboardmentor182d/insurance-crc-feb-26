// Shape helpers for policy-related data.

/**
 * @typedef {Object} ActivePolicy
 * @property {number} id
 * @property {string} policyNumber
 * @property {string} status
 * @property {string} category
 * @property {string} insurerName
 * @property {string} productName
 * @property {number} premiumAnnual
 * @property {number} coverageAmount
 * @property {number | null} deductibleAmount
 * @property {string} startDate
 * @property {string} endDate
 * @property {boolean} isExpiringSoon
 * @property {string | null} warningText
 */

/**
 * @typedef {Object} ActivePoliciesSummary
 * @property {number} activeCount
 * @property {number} expiringSoonCount
 * @property {number} totalCoverage
 * @property {number} annualPremium
 */

// These typedefs are here mainly for editor intellisense and documentation.
// The runtime shape comes directly from the backend responses.

