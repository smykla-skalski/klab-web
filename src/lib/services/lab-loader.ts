import { labSchema, type Lab } from '$lib/schemas/lab.schema';
import { categorySchema, type Category } from '$lib/schemas/category.schema';
import categoriesData from '$lib/content/categories.json';

// Import all lab files
import kubernetesBasicDeployment from '$lib/content/labs/kubernetes/basic-deployment.json';
import kubernetesServiceNetworking from '$lib/content/labs/kubernetes/service-networking.json';
import kubernetesConfigmapsSecrets from '$lib/content/labs/kubernetes/configmaps-secrets.json';
import linuxFilePermissions from '$lib/content/labs/linux/file-permissions.json';
import linuxProcessManagement from '$lib/content/labs/linux/process-management.json';
import dockerContainerBasics from '$lib/content/labs/docker/container-basics.json';
import dockerDockerfileCreation from '$lib/content/labs/docker/dockerfile-creation.json';

const rawLabs = [
	kubernetesBasicDeployment,
	kubernetesServiceNetworking,
	kubernetesConfigmapsSecrets,
	linuxFilePermissions,
	linuxProcessManagement,
	dockerContainerBasics,
	dockerDockerfileCreation
];

export function getAllLabs(): Lab[] {
	return rawLabs.map((lab) => labSchema.parse(lab));
}

export function getLabsByCategory(category: string): Lab[] {
	const labs = getAllLabs();
	return labs.filter((lab) => lab.category === category);
}

export function getLab(category: string, labId: string): Lab | null {
	const labs = getLabsByCategory(category);
	return labs.find((lab) => lab.id === labId) || null;
}

export function getCategories(): Category[] {
	return categoriesData.map((category) => categorySchema.parse(category));
}
