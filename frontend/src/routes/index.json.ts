export async function get(): Promise<{ body: any}> {
    const result = await (
        await fetch()
    ).json();
}