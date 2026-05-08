const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.txt': 'text/plain'
};

const TEST_USERS = {
    'admin': '123456'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

function serveStaticFile(res, filePath, mimeType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
}

function parsePostData(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const params = new URLSearchParams(body);
                const obj = {};
                for (const [key, value] of params) {
                    obj[key] = value;
                }
                resolve(obj);
            } catch (e) {
                reject(e);
            }
        });
        req.on('error', reject);
    });
}

function handleAPI(res, pathname, method, postData) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (pathname === '/admin/login' && method === 'POST') {
        const { aname, lpwd, mid } = postData;

        if (TEST_USERS[aname] && TEST_USERS[aname] === lpwd) {
            const response = {
                state: 1,
                message: '登录成功',
                newtoken: 'test_token_' + Date.now(),
                mid: mid || '1'
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        } else {
            const response = {
                state: 0,
                message: '账号或密码错误',
                newtoken: null,
                mid: mid || '1'
            };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        }
        return;
    }

    if (pathname === '/user/systemconfig' && method === 'POST') {
        const response = {
            state: 1,
            message: null,
            newtoken: null,
            mid: postData.mid || '1',
            info: {
                mid: parseInt(postData.mid) || 1,
                domain: 'http://localhost:' + PORT,
                mname: 'MySite',
                web_open: 1,
                logo: 'default.png',
                global_title: '我的网站',
                global_skin: 'default',
                global_jumpurl: '/',
                global_appname: 'MySite',
                global_appversion: '1.0.0',
                global_downappurl: '',
                global_isbalance: 1,
                global_iscurrency: 1,
                global_isintegral: 1,
                global_isdeposit: 1,
                global_balancename: '余额',
                global_currencyname: '积分',
                global_integralname: '金币',
                global_depositname: '储值',
                global_regvcode: 0,
                isvip: 1,
                isvip_month: 1,
                isvip_year: 1,
                isvip_forever: 1,
                isprebook: 1,
                isgroup: 1,
                isgroup_buying: 1,
                istrust: 1,
                delivername1: '送货上门',
                delivername2: '到店自提',
                faretpname: '运费',
                withdrawal_name: '提现',
                pv_name: 'PV',
                exp_name: 'EXP'
            },
            islogin: 0
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API not found' }));
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (pathname.startsWith('/api/') || pathname === '/admin/login' || pathname === '/user/systemconfig') {
        const postData = method !== 'GET' ? await parsePostData(req) : {};
        handleAPI(res, pathname, method, { ...parsedUrl.query, ...postData });
        return;
    }

    let filePath = path.join(__dirname, 'login', pathname === '/' ? 'zpx.belmorian.com/_admin/login.html' : pathname);

    filePath = decodeURIComponent(filePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        serveStaticFile(res, filePath, getMimeType(filePath));
    } else {
        filePath = path.join(__dirname, 'login', 'zpx.belmorian.com/_admin/login.html');
        serveStaticFile(res, filePath, 'text/html; charset=utf-8');
    }
});

server.listen(PORT, () => {
    console.log('===========================================');
    console.log('  🚀 我的网站登录系统已启动');
    console.log('===========================================');
    console.log('');
    console.log('  访问地址: http://localhost:' + PORT);
    console.log('');
    console.log('  测试账号: admin');
    console.log('  测试密码: 123456');
    console.log('');
    console.log('  按 Ctrl+C 停止服务器');
    console.log('===========================================');
});
