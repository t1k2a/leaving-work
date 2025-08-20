export const testUsers = {
  validUser: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'testpassword123',
    name: 'Test User'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
    name: 'Invalid User'
  }
};

export const checkoutMessages = {
  success: '退勤処理が完了しました',
  error: 'エラーが発生しました',
  confirmation: '退勤してもよろしいですか？'
};

export const testTimeouts = {
  short: 1000,
  medium: 5000,
  long: 10000
};