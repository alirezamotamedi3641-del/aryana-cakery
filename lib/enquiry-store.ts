interface EnquiryRecord {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  required_date: string;
  message: string;
  image_key: string | null;
  image_name: string | null;
  image_type: string | null;
  image_bytes: number | null;
  created_at: string;
}

const enquiriesMap = new Map<string, EnquiryRecord>();
const bucketMap = new Map<string, ArrayBuffer | Uint8Array>();

export function getEnquiryStorage() {
  return {
    db: {
      prepare(sql: string) {
        return {
          bind(...args: unknown[]) {
            return {
              async first<T = unknown>(): Promise<T | null> {
                if (sql.includes('SELECT reference FROM cake_enquiries WHERE id = ?')) {
                  const id = String(args[0]);
                  const rec = enquiriesMap.get(id);
                  if (rec) {
                    return { reference: rec.reference } as unknown as T;
                  }
                  return null;
                }
                return null;
              },
              async run() {
                if (sql.includes('INSERT INTO cake_enquiries')) {
                  const [
                    id, reference, name, email, phone, required_date,
                    message, image_key, image_name, image_type, image_bytes, created_at
                  ] = args;
                  if (enquiriesMap.has(String(id))) {
                    return { meta: { changes: 0 } };
                  }
                  enquiriesMap.set(String(id), {
                    id: String(id),
                    reference: String(reference),
                    name: String(name),
                    email: String(email),
                    phone: String(phone),
                    required_date: String(required_date),
                    message: String(message),
                    image_key: image_key ? String(image_key) : null,
                    image_name: image_name ? String(image_name) : null,
                    image_type: image_type ? String(image_type) : null,
                    image_bytes: typeof image_bytes === 'number' ? image_bytes : null,
                    created_at: String(created_at)
                  });
                  return { meta: { changes: 1 } };
                }
                return { meta: { changes: 0 } };
              }
            };
          }
        };
      }
    },
    bucket: {
      async put(key: string, value: ArrayBuffer | Uint8Array, _options?: unknown) {
        bucketMap.set(key, value);
        return {};
      },
      async delete(key: string) {
        bucketMap.delete(key);
      },
      async get(key: string) {
        return bucketMap.get(key) ?? null;
      }
    }
  };
}
