import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import LabCard from './LabCard.svelte';
import type { Lab } from '$lib/schemas/lab.schema';

const mockLab: Lab = {
	id: 'test-lab',
	title: 'Test Lab',
	description: 'This is a test lab description for testing purposes',
	category: 'kubernetes',
	difficulty: 'Beginner',
	duration: '30 minutes',
	tags: ['docker', 'containers', 'orchestration', 'extra-tag'],
	objective: 'Learn to use containers',
	hints: ['Hint 1', 'Hint 2'],
	solution: 'kubectl apply -f deployment.yaml',
	knowledgeArticle: 'test-article'
};

describe('LabCard', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders lab title', () => {
		render(LabCard, { props: { lab: mockLab } });
		expect(screen.getByText('Test Lab')).toBeTruthy();
	});

	it('renders lab description', () => {
		render(LabCard, { props: { lab: mockLab } });
		expect(screen.getByText(/test lab description/i)).toBeTruthy();
	});

	it('renders difficulty badge', () => {
		render(LabCard, { props: { lab: mockLab } });
		expect(screen.getByText('Beginner')).toBeTruthy();
	});

	it('renders duration', () => {
		render(LabCard, { props: { lab: mockLab } });
		expect(screen.getByText('30 minutes')).toBeTruthy();
	});

	it('renders up to 3 tags', () => {
		render(LabCard, { props: { lab: mockLab } });
		expect(screen.getByText('docker')).toBeTruthy();
		expect(screen.getByText('containers')).toBeTruthy();
		expect(screen.getByText('orchestration')).toBeTruthy();
		expect(screen.queryByText('extra-tag')).toBeFalsy();
	});

	it('applies correct difficulty color for Beginner', () => {
		render(LabCard, { props: { lab: mockLab } });
		const badge = screen.getByText('Beginner');
		expect(badge.className).toContain('bg-muted/50');
		expect(badge.className).toContain('text-green-600');
	});

	it('applies correct difficulty color for Intermediate', () => {
		const intermediateLab = { ...mockLab, difficulty: 'Intermediate' as const };
		render(LabCard, { props: { lab: intermediateLab } });
		const badge = screen.getByText('Intermediate');
		expect(badge.className).toContain('bg-muted/50');
		expect(badge.className).toContain('text-yellow-600');
	});

	it('applies correct difficulty color for Advanced', () => {
		const advancedLab = { ...mockLab, difficulty: 'Advanced' as const };
		render(LabCard, { props: { lab: advancedLab } });
		const badge = screen.getByText('Advanced');
		expect(badge.className).toContain('bg-muted/50');
		expect(badge.className).toContain('text-red-600');
	});

	it('shows completion icon when completed', () => {
		render(LabCard, { props: { lab: mockLab, isCompleted: true } });
		const completedIcon = screen.getByLabelText('Completed');
		expect(completedIcon).toBeTruthy();
	});

	it('hides completion icon when not completed', () => {
		render(LabCard, { props: { lab: mockLab, isCompleted: false } });
		const completedIcon = screen.queryByLabelText('Completed');
		expect(completedIcon).toBeFalsy();
	});

	it('handles click events', async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();

		render(LabCard, { props: { lab: mockLab, onclick: handleClick } });

		const button = screen.getByRole('button');
		await user.click(button);

		expect(handleClick).toHaveBeenCalledOnce();
	});

	it('has correct aria-label', () => {
		render(LabCard, { props: { lab: mockLab } });
		const button = screen.getByRole('button');
		expect(button.getAttribute('aria-label')).toBe('Open Test Lab lab');
	});

	it('renders as a button', () => {
		render(LabCard, { props: { lab: mockLab } });
		expect(screen.getByRole('button')).toBeTruthy();
	});

	it('renders clock icon', () => {
		render(LabCard, { props: { lab: mockLab } });
		const container = document.body;
		// Check for SVG element (clock icon)
		expect(container.querySelector('svg')).toBeTruthy();
	});

	it('handles lab with no tags', () => {
		const labNoTags = { ...mockLab, tags: [] };
		render(LabCard, { props: { lab: labNoTags } });
		// Should render without errors
		expect(screen.getByText('Test Lab')).toBeTruthy();
	});

	it('handles lab with fewer than 3 tags', () => {
		const labFewTags = { ...mockLab, tags: ['docker', 'kubernetes'] };
		render(LabCard, { props: { lab: labFewTags } });
		expect(screen.getByText('docker')).toBeTruthy();
		expect(screen.getByText('kubernetes')).toBeTruthy();
		expect(screen.queryByText('containers')).toBeFalsy();
	});

	it('handles long description with line clamp', () => {
		const longDesc = 'A'.repeat(200);
		const labLongDesc = { ...mockLab, description: longDesc };
		render(LabCard, { props: { lab: labLongDesc } });

		const description = screen.getByText(longDesc);
		expect(description.className).toContain('line-clamp-2');
	});
});
