(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/services/supabaseClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://vmtklhmiuxbfxmhpnjoi.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtdGtsaG1pdXhiZnhtaHBuam9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MTgwMTcsImV4cCI6MjA4MjQ5NDAxN30.62uIPu8sarcMIZv4OgRqplmxVmOxqbTYIPIv1vv4ICo");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl || '', supabaseAnonKey || '');
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/services/supabaseDB.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchPunchLogs",
    ()=>fetchPunchLogs,
    "fetchStaffMembers",
    ()=>fetchStaffMembers,
    "fetchSupplyRequests",
    ()=>fetchSupplyRequests,
    "fetchTaskLogs",
    ()=>fetchTaskLogs,
    "insertPunchLog",
    ()=>insertPunchLog,
    "insertStaffMember",
    ()=>insertStaffMember,
    "insertSupplyRequest",
    ()=>insertSupplyRequest,
    "insertTaskLog",
    ()=>insertTaskLog,
    "updateSupplyStatus",
    ()=>updateSupplyStatus,
    "verifyStaffPin",
    ()=>verifyStaffPin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/supabaseClient.ts [app-client] (ecmascript)");
;
async function fetchStaffMembers() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('staff_members').select('*').order('id');
    if (error) throw error;
    return (data || []).map((row)=>({
            id: row.id,
            name: row.name,
            role: row.role,
            avatar: row.avatar || '',
            blockAssignment: row.block_assignment || ''
        }));
}
async function verifyStaffPin(staffId, pin) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('staff_members').select('pin').eq('id', staffId).single();
    if (error || !data) return false;
    return data.pin === pin;
}
async function insertStaffMember(staff) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('staff_members').insert({
        name: staff.name,
        role: staff.role,
        avatar: staff.avatar,
        block_assignment: staff.blockAssignment
    }).select().single();
    if (error) throw error;
    return {
        id: data.id,
        name: data.name,
        role: data.role,
        avatar: data.avatar || '',
        blockAssignment: data.block_assignment || ''
    };
}
async function fetchTaskLogs() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('task_logs').select('*').order('timestamp', {
        ascending: false
    });
    if (error) throw error;
    return (data || []).map((row)=>({
            id: row.id,
            taskId: row.task_id,
            staffId: row.staff_id,
            timestamp: row.timestamp,
            status: row.status,
            imageUrl: row.image_url || undefined,
            aiFeedback: row.ai_feedback || undefined,
            aiRating: row.ai_rating || undefined,
            block: row.block || undefined,
            floor: row.floor || undefined,
            flat: row.flat || undefined
        }));
}
async function insertTaskLog(log) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('task_logs').insert({
        task_id: log.taskId,
        staff_id: log.staffId,
        timestamp: log.timestamp,
        status: log.status,
        image_url: log.imageUrl || null,
        ai_feedback: log.aiFeedback || null,
        ai_rating: log.aiRating || null,
        block: log.block || null,
        floor: log.floor || null,
        flat: log.flat || null
    }).select().single();
    if (error) throw error;
    return {
        id: data.id,
        taskId: data.task_id,
        staffId: data.staff_id,
        timestamp: data.timestamp,
        status: data.status,
        imageUrl: data.image_url || undefined,
        aiFeedback: data.ai_feedback || undefined,
        aiRating: data.ai_rating || undefined,
        block: data.block || undefined,
        floor: data.floor || undefined,
        flat: data.flat || undefined
    };
}
async function fetchPunchLogs() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('punch_logs').select('*').order('timestamp', {
        ascending: false
    });
    if (error) throw error;
    return (data || []).map((row)=>({
            id: row.id,
            staffId: row.staff_id,
            type: row.type,
            timestamp: row.timestamp
        }));
}
async function insertPunchLog(log) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('punch_logs').insert({
        staff_id: log.staffId,
        type: log.type,
        timestamp: log.timestamp
    }).select().single();
    if (error) throw error;
    return {
        id: data.id,
        staffId: data.staff_id,
        type: data.type,
        timestamp: data.timestamp
    };
}
async function fetchSupplyRequests() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('supply_requests').select('*').order('timestamp', {
        ascending: false
    });
    if (error) throw error;
    return (data || []).map((row)=>({
            id: row.id,
            item: row.item,
            quantity: row.quantity,
            urgency: row.urgency,
            status: row.status,
            requesterId: row.requester_id,
            timestamp: row.timestamp
        }));
}
async function insertSupplyRequest(req) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('supply_requests').insert({
        item: req.item,
        quantity: req.quantity,
        urgency: req.urgency,
        status: req.status,
        requester_id: req.requesterId,
        timestamp: req.timestamp
    }).select().single();
    if (error) throw error;
    return {
        id: data.id,
        item: data.item,
        quantity: data.quantity,
        urgency: data.urgency,
        status: data.status,
        requesterId: data.requester_id,
        timestamp: data.timestamp
    };
}
async function updateSupplyStatus(id, status) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('supply_requests').update({
        status
    }).eq('id', id);
    if (error) throw error;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/supabaseDB.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useAuth = ()=>{
    _s();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
_s(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
const AuthProvider = ({ children })=>{
    _s1();
    const [isLoggedIn, setIsLoggedIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [role, setRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [staffId, setStaffId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [staffName, setStaffName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const loginAsStaff = async (id, name, pin)=>{
        setLoading(true);
        try {
            const valid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$supabaseDB$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verifyStaffPin"])(id, pin);
            if (!valid) {
                setLoading(false);
                return {
                    error: 'Incorrect PIN. Try again.'
                };
            }
            setIsLoggedIn(true);
            setRole('staff');
            setStaffId(id);
            setStaffName(name);
            setLoading(false);
            return {
                error: null
            };
        } catch (err) {
            setLoading(false);
            return {
                error: 'Could not verify PIN. Check your connection.'
            };
        }
    };
    const loginAsAdmin = async (username, password)=>{
        setLoading(true);
        // Hardcoded admin credentials
        if (username === 'admin' && password === 'admin123') {
            setIsLoggedIn(true);
            setRole('admin');
            setStaffId(null);
            setStaffName('Admin');
            setLoading(false);
            return {
                error: null
            };
        }
        setLoading(false);
        return {
            error: 'Invalid admin credentials.'
        };
    };
    const logout = ()=>{
        setIsLoggedIn(false);
        setRole(null);
        setStaffId(null);
        setStaffName(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            isLoggedIn,
            role,
            staffId,
            staffName,
            loading,
            loginAsStaff,
            loginAsAdmin,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/AuthContext.tsx",
        lineNumber: 76,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(AuthProvider, "ka1yfpDczqO8KUGIeZ9WDF3MGz4=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_d6f3cf59._.js.map