import { createClient } from '@supabase/supabase-js';

const collectionsSupabaseUrl = process.env.NEXT_PUBLIC_COLLECTIONS_SUPABASE_URL;
const collectionsSupabaseAnonKey = process.env.NEXT_PUBLIC_COLLECTIONS_SUPABASE_ANON_KEY;

let collectionsClient: any = null;

if (collectionsSupabaseUrl && collectionsSupabaseAnonKey) {
    collectionsClient = createClient(collectionsSupabaseUrl, collectionsSupabaseAnonKey);
} else {
    console.warn('Collections Supabase credentials missing!');
}

/**
 * Fetches payment status for all flats for the current month.
 * Returns a Map where key is Flat_No and value is true (Paid) or false (Unpaid).
 * Flats not present in the map should be considered "Not Found" / Disabled.
 */
export const fetchFlatPaymentStatus = async (): Promise<Map<string, boolean>> => {
    if (!collectionsClient) return new Map();

    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const currentMonthColumn = `${month}_${year}`; // e.g. "February_2026"

    // Query table for Flat_No and the current month's column
    const { data, error } = await collectionsClient
        .from('Collections_2026')
        .select(`Flat_No, ${currentMonthColumn}`);

    if (error) {
        console.error('Error fetching payment status:', error);
        return new Map();
    }

    const statusMap = new Map<string, boolean>();

    data.forEach((row: any) => {
        const flatNo = row.Flat_No?.trim();
        if (!flatNo) return;

        const paymentValue = row[currentMonthColumn];
        // Check if value is 'N/A' or '0' (case-insensitive for N/A just in case)
        const isUnpaid =
            paymentValue === 0 ||
            paymentValue === '0' ||
            (typeof paymentValue === 'string' && paymentValue.trim().toUpperCase() === 'N/A');

        statusMap.set(flatNo, !isUnpaid); // true = Paid, false = Unpaid
    });

    return statusMap;
};
