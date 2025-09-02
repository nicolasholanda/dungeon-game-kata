const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body ? JSON.parse(body) : null
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body
                    });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    const baseUrl = 'localhost';
    const port = 3000;

    console.log('🧪 Testing Mock Dungeon Game API Server');
    console.log('========================================');

    // Test 1: GET /hello
    console.log('\n1. Testing GET /hello');
    try {
        const response = await makeRequest({
            hostname: baseUrl,
            port: port,
            path: '/hello',
            method: 'GET'
        });

        console.log(`   Status: ${response.statusCode}`);
        console.log(`   Response: ${JSON.stringify(response.body)}`);
        
        if (response.statusCode === 200 && response.body.status === 'ok') {
            console.log('   ✅ PASS');
        } else {
            console.log('   ❌ FAIL');
        }
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
    }

    // Test 2: POST /dungeon/solve with valid input
    console.log('\n2. Testing POST /dungeon/solve with valid input');
    try {
        const dungeonGrid = [[1, -3, 3], [0, -2, 0], [-3, -3, -3]];
        const response = await makeRequest({
            hostname: baseUrl,
            port: port,
            path: '/dungeon/solve',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, dungeonGrid);

        console.log(`   Status: ${response.statusCode}`);
        console.log(`   Response: ${JSON.stringify(response.body, null, 2)}`);
        
        if (response.statusCode === 200 && 
            response.body.minimumHP && 
            Array.isArray(response.body.path)) {
            console.log('   ✅ PASS');
        } else {
            console.log('   ❌ FAIL');
        }
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
    }

    // Test 3: POST /dungeon/solve with invalid input
    console.log('\n3. Testing POST /dungeon/solve with invalid input (empty array)');
    try {
        const response = await makeRequest({
            hostname: baseUrl,
            port: port,
            path: '/dungeon/solve',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, []);

        console.log(`   Status: ${response.statusCode}`);
        console.log(`   Response: ${JSON.stringify(response.body, null, 2)}`);
        
        if (response.statusCode === 400 && 
            response.body.message.includes('Dungeon array cannot be null or empty')) {
            console.log('   ✅ PASS');
        } else {
            console.log('   ❌ FAIL');
        }
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
    }

    // Test 4: POST /dungeon/solve with malformed JSON
    console.log('\n4. Testing POST /dungeon/solve with malformed JSON');
    try {
        const req = http.request({
            hostname: baseUrl,
            port: port,
            path: '/dungeon/solve',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    console.log(`   Status: ${res.statusCode}`);
                    console.log(`   Response: ${JSON.stringify(parsed, null, 2)}`);
                    
                    if (res.statusCode === 400 && 
                        parsed.message.includes('Invalid JSON format')) {
                        console.log('   ✅ PASS');
                    } else {
                        console.log('   ❌ FAIL');
                    }
                } catch (error) {
                    console.log(`   ❌ FAIL - Could not parse response: ${body}`);
                }
            });
        });

        req.write('{"invalid": json}'); // Malformed JSON
        req.end();
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
    }

    // Test 5: GET non-existent endpoint
    console.log('\n5. Testing GET /nonexistent (404 test)');
    try {
        const response = await makeRequest({
            hostname: baseUrl,
            port: port,
            path: '/nonexistent',
            method: 'GET'
        });

        console.log(`   Status: ${response.statusCode}`);
        console.log(`   Response: ${JSON.stringify(response.body, null, 2)}`);
        
        if (response.statusCode === 404) {
            console.log('   ✅ PASS');
        } else {
            console.log('   ❌ FAIL');
        }
    } catch (error) {
        console.log(`   ❌ ERROR: ${error.message}`);
    }

    console.log('\n========================================');
    console.log('🏁 Tests completed!');
}

// Check if server is running before testing
const testConnection = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/hello',
    method: 'GET'
}, (res) => {
    console.log('Server is running, starting tests...');
    runTests();
});

testConnection.on('error', (error) => {
    console.log('❌ Server is not running on port 3000');
    console.log('Please start the server with: npm start');
    process.exit(1);
});

testConnection.end();
