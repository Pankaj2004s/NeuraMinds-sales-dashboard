// Word-number map for quantities written as words
const wordToNum = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
}

const monthMap = {
  jan: '01', feb: '02', mar: '03', apr: '04',
  may: '05', jun: '06', jul: '07', aug: '08',
  sep: '09', oct: '10', nov: '11', dec: '12',
}

function parseDate(raw) {
  if (!raw || !raw.trim()) return null
  const d = raw.trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    return new Date(d)
  }

  const monMatch = d.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/)
  if (monMatch) {
    const month = monthMap[monMatch[2].toLowerCase()]
    if (month) return new Date(`${monMatch[3]}-${month}-${monMatch[1]}`)
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
    const [day, month, year] = d.split('/')
    return new Date(`${year}-${month}-${day}`)
  }

  const dashMatch = d.match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (dashMatch) {
    const seg1 = parseInt(dashMatch[1], 10)
    const seg2 = parseInt(dashMatch[2], 10)
    if (seg2 > 12) {
      return new Date(`${dashMatch[3]}-${dashMatch[1]}-${dashMatch[2]}`)
    }
    return new Date(`${dashMatch[3]}-${dashMatch[1]}-${dashMatch[2]}`)
  }

  return null
}

function normalise(str) {
  if (!str) return ''
  return str.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

export function cleanData(rawRows) {
  const issueLog = {
    droppedNegativePrice: [],
    droppedMissingPrice:  [],
    droppedBadQuantity:   [],
    droppedDuplicates:    [],
    droppedBadDate:       [],
    droppedEmptyRegion:   [],  
    fixedQuantityWords:   [],
    fixedCasing:          0,
    fixedRatingMissing:   [],
  }

  const seenOrderIds = new Set()
  const cleanRows = []

  for (const raw of rawRows) {
    const orderId = (raw['OrderID'] || '').trim()

    if (!orderId) continue

    if (seenOrderIds.has(orderId)) {
      issueLog.droppedDuplicates.push(orderId)
      continue
    }
    seenOrderIds.add(orderId)

    const rawPrice = (raw['UnitPrice'] || '').trim()
    if (!rawPrice) {
      issueLog.droppedMissingPrice.push(orderId)
      continue
    }
    const price = parseFloat(rawPrice)
    if (isNaN(price) || price < 0) {
      issueLog.droppedNegativePrice.push(orderId)
      continue
    }

    const rawQty = (raw['Quantity'] || '').trim().toLowerCase()
    let quantity
    if (rawQty === 'n/a' || rawQty === '') {
      issueLog.droppedBadQuantity.push(orderId)
      continue
    } else if (wordToNum[rawQty] !== undefined) {
      quantity = wordToNum[rawQty]
      issueLog.fixedQuantityWords.push(orderId)
    } else {
      quantity = parseInt(rawQty, 10)
      if (isNaN(quantity) || quantity <= 0) {
        issueLog.droppedBadQuantity.push(orderId)
        continue
      }
    }

    const date = parseDate(raw['Date'])
    if (!date || isNaN(date.getTime())) {
      issueLog.droppedBadDate.push(orderId)
      continue
    }

    const rawCategory = raw['Category'] || ''
    const rawRegion   = raw['Region']   || ''
    const category    = normalise(rawCategory)
    const region      = normalise(rawRegion) || 'Unknown'

    if (rawCategory !== normalise(rawCategory) || rawRegion !== normalise(rawRegion)) {
      issueLog.fixedCasing++
    }

    const rawRating = (raw['Rating'] || '').trim()
    let rating = rawRating ? parseFloat(rawRating) : null
    if (rawRating && isNaN(rating)) rating = null
    if (!rawRating) issueLog.fixedRatingMissing.push(orderId)

    cleanRows.push({
      orderId,
      date,
      month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      product:      (raw['Product']      || '').trim(),
      category,
      region,
      quantity,
      unitPrice: price,
      revenue: quantity * price,
      customerName: (raw['CustomerName'] || '').trim(),
      rating,
    })
  }

  return { cleanRows, issueLog }
}
