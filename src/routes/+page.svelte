<script lang="ts">
import { Copyright } from '$lib/components/copyright/index.js'
import { Button } from '$lib/components/ui/button'
import { Card, CardContent } from '$lib/components/ui/card'

let { data } = $props()
</script>

<div class="bg-muted min-h-svh flex flex-col items-center justify-center gap-6 p-6 md:p-10 relative">
	<div class="w-full max-w-sm">
		<div class="flex flex-col gap-6">
			<Card>
				<CardContent class="flex flex-col items-center justify-center gap-4">
					<p>Ingelogd als {data.session?.user.email}</p>

					{#if data.roles.includes('admin')}
						<Button variant="link" href="/admin">Naar admin dashboard</Button>
					{/if}

					<form action="/auth/logout" method="GET">
						<Button type="submit">Uitloggen</Button>
					</form>
				</CardContent>
			</Card>
			<Copyright />
		</div>
	</div>
</div>

