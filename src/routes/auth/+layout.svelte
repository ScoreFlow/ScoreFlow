<script>
  import { Copyright } from "$lib/components/copyright"
  import { Card } from "$lib/components/ui/card"

  let { children } = $props()
</script>

<div class="bg-muted min-h-svh flex flex-col items-center justify-center gap-6 p-6 md:p-10 relative">
	<div class="w-full max-w-sm has-[.wide-content]:max-w-3xl">
		<div class="flex flex-col gap-6">
			<Card class="overflow-hidden p-0">
				{@render children()}
			</Card>
			<Copyright/>
		</div>
	</div>
</div>