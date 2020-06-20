export function getEnv(envName: string): string {
  const env = process.env[envName];
  if (!env) throw new Error(`process.env.${envName} must be exists`);

  return env;
}
