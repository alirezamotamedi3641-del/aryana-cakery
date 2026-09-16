import {env} from 'cloudflare:workers';
export function getEnquiryStorage(){const bindings=env as unknown as {DB?:D1Database;BUCKET?:R2Bucket};if(!bindings.DB||!bindings.BUCKET)throw new Error('Enquiry storage unavailable');return {db:bindings.DB,bucket:bindings.BUCKET};}
