import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuthClient() {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
  
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("Missing Google Service Account credentials");
  }
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
  return auth.getClient();
}

export async function appendOrderToSheet(orderData) {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // OrderData: [OrderID, Date, ProductName, Quantity, CustomerName, Phone, Address, City, State, Pincode, Status]
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [orderData],
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error appending to Google Sheet:', error);
    throw error;
  }
}

export async function updateOrderStatusInSheet(orderId, newStatus) {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // 1. Find the row with the given orderId
    const getRows = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:K',
    });

    const rows = getRows.data.values;
    if (!rows || rows.length === 0) return null;

    let rowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      // Assuming OrderID is in Column A
      if (rows[i][0] === orderId) { 
        rowIndex = i + 1; // Google Sheets is 1-indexed
        break;
      }
    }

    if (rowIndex === -1) {
      console.log('Order not found in sheet');
      return null;
    }

    // 2. Update the status column (Column K)
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!K${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[newStatus]],
      },
    });

    return updateResponse.data;
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    throw error;
  }
}
