const PROJECT_PREFIX = "visora_project_";

const jsonError = (status, message, extra = {}) => {
    return new Response(JSON.stringify({ error: message, ...extra }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": '*'
        }
    });
}

const getUserId = async (userPuter) => {
    try {
        const user = await userPuter.auth.getUser();

        return user?.uuid || null;
    } catch (error) {
        return null;
    }
}

router.get('/api/projects/list', async ({ user }) => {
    try {
        const userPuter = user?.puter;

        if (!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const projectList = [];
        const listResponse = await userPuter.kv.list?.(PROJECT_PREFIX);
        const entries = Array.isArray(listResponse)
            ? listResponse
            : Array.isArray(listResponse?.items)
                ? listResponse.items
                : Array.isArray(listResponse?.results)
                    ? listResponse.results
                    : [];

        for (const entry of entries) {
            const key = typeof entry === 'string'
                ? entry
                : entry?.key || entry?.name || entry?.id || null;

            if (!key || !String(key).startsWith(PROJECT_PREFIX)) continue;

            const project = await userPuter.kv.get(key).catch(() => null);
            if (project !== null && project !== undefined) {
                projectList.push(project);
            }
        }

        return { projects: projectList };
    } catch (e) {
        return jsonError(500, 'Failed to list projects', { message: e?.message || 'Unknown error' });
    }
});

router.get('/api/projects/get', async ({ request, user }) => {
    try {
        const userPuter = user?.puter;

        if (!userPuter) return jsonError(401, 'Authentication failed');

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) return jsonError(400, 'Project id is required');

        const key = `${PROJECT_PREFIX}${id}`;
        const project = await userPuter.kv.get(key);

        if (!project) return jsonError(404, 'Project not found');

        return { project };
    } catch (e) {
        return jsonError(500, 'Failed to get project', { message: e?.message || 'Unknown error' });
    }
});

router.post('/api/projects/save', async ({ request, user }) => {
    try {
        const userPuter = user?.puter;

        if (!userPuter) return jsonError(401, 'Authentication failed');

        const body = await request.json();
        const project = body?.project;

        if (!project?.id || !project?.sourceImage) return jsonError(400, 'Project Id and source image are required');

        const payload = {
            ...project,
            updatedAt: new Date().toISOString(),
        };

        const userId = await getUserId(userPuter);
        if (!userId) return jsonError(401, 'Authentication failed');

        const key = `${PROJECT_PREFIX}${project.id}`;
        await userPuter.kv.set(key, payload);

        return { saved: true, id: project.id, project: payload };
    } catch (e) {
        return jsonError(500, 'Failed to save project', { message: e?.message || 'Unknown error' });
    }
});