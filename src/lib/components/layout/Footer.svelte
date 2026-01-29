<script lang="ts">
	import { Github } from 'lucide-svelte';
</script>

<footer class="border-border bg-background border-t">
	<div class="container mx-auto px-4 py-8">
		<div class="grid gap-8 md:grid-cols-3">
			<div>
				<h3 class="mb-4 text-sm font-semibold">klab</h3>
				<p class="text-muted-foreground text-sm">
					Interactive learning platform for hands-on technical education.
				</p>
			</div>

			<div>
				<h3 class="mb-4 text-sm font-semibold">Resources</h3>
				<ul class="text-muted-foreground space-y-2 text-sm">
					<li><a href="/learn" class="hover:text-primary transition-colors">Browse Labs</a></li>
					<li><a href="/docs" class="hover:text-primary transition-colors">Documentation</a></li>
					<li><a href="/about" class="hover:text-primary transition-colors">About</a></li>
				</ul>
			</div>

			<div>
				<h3 class="mb-4 text-sm font-semibold">Community</h3>
				<ul class="text-muted-foreground space-y-2 text-sm">
					<li>
						<a
							href="https://github.com/klab"
							class="hover:text-primary inline-flex items-center gap-2 transition-colors"
						>
							<Github class="h-4 w-4" />
							GitHub
						</a>
					</li>
				</ul>
			</div>
		</div>

		<div class="border-border text-muted-foreground mt-8 border-t pt-4 text-center text-sm">
			<p>&copy; {new Date().getFullYear()} klab. All rights reserved.</p>
		</div>
	</div>
</footer>
